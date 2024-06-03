package english_ai_tutor.conversation_service.handler;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import english_ai_tutor.conversation_service.dto.ChatMessageDto;
import english_ai_tutor.conversation_service.dto.openai.TTSRequest;
import english_ai_tutor.conversation_service.dto.openai.Voice;
import english_ai_tutor.conversation_service.dto.conversation.ConversationPromptDto;
import english_ai_tutor.conversation_service.service.*;
import english_ai_tutor.conversation_service.utils.ByteUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.ByteBuffer;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import static english_ai_tutor.conversation_service.dto.ChatMessageDto.Role.*;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final Map<String, ChatMemory> chatMemories = new ConcurrentHashMap<>();
    private final Map<String, List<Byte>> binaryMessagesBySession = new ConcurrentHashMap<>();
    private final Map<String, String> voices = new ConcurrentHashMap<>();
    private final ConversationService conversationService;
    private final OpenAIAudioService audioService;
    private final OpenAiChatService chatService;
    private final ChatMessageService chatMessageService;
    private final RoleSwitchChatMessageService roleSwitchChatMessageService;

    public ChatWebSocketHandler(ConversationService conversationService, OpenAIAudioService audioService, OpenAiChatService chatService, ChatMessageService chatMessageService, RoleSwitchChatMessageService roleSwitchChatMessageService) {
        this.conversationService = conversationService;
        this.audioService = audioService;
        this.chatService = chatService;
        this.chatMessageService = chatMessageService;
        this.roleSwitchChatMessageService = roleSwitchChatMessageService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // ChatMemory 생성
        ChatMemory chatMemory = TokenWindowChatMemory
                .withMaxTokens(1000, new OpenAiTokenizer(OpenAiChatModelName.GPT_4_TURBO_PREVIEW));
        // 세션에 저장된 속성값 이용
        Map<String, Object> attributes = session.getAttributes();
        String channelId = (String) attributes.get("channel_id");

        chatMemories.put(channelId, chatMemory);

        Long conversationId = Long.valueOf((String)attributes.get("conversation_id"));

        // 회화 프롬프트 조회
        ConversationPromptDto conversationPrompt = conversationService.findConversationPrompt(conversationId);

        // 시스템 메시지 생성
        SystemMessage systemMessage = SystemMessage.from(conversationPrompt.getPrompt());
        chatMemory.add(systemMessage);

        AiMessage aiMessage = chatService.chat(chatMemory);

        chatMessageService.save(channelId, ChatMessageDto.Command.builder().role(ASSISTANT).content(aiMessage.text()).build());

        roleSwitchChatMessageService.save(channelId, ChatMessageDto.Command.builder().role(SYSTEM).content(conversationPrompt.getRoleSwitchPrompt()).build());
        roleSwitchChatMessageService.save(channelId, ChatMessageDto.Command.builder().role(USER).content(aiMessage.text()).build());

        String voice = Voice.getRandomVoice();
        voices.put(channelId, voice);

        TTSRequest request = TTSRequest.builder()
                .input(aiMessage.text())
                .voice(voice)
                .response_format("mp3")
                .build();


        byte[] byteData = audioService.createSpeech(request);
        binaryMessagesBySession.put(channelId, new ArrayList<Byte>());
        BinaryMessage binaryMessage = new BinaryMessage(byteData);
        session.sendMessage(binaryMessage);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        Map<String, Object> attributes = session.getAttributes();
        String channelId = (String)attributes.get("channel_id");

        ByteBuffer buffer = message.getPayload();

        byte[] byteArray = new byte[buffer.remaining()];
        buffer.get(byteArray);

        ArrayList<Byte> byteMessage = (ArrayList<Byte>)binaryMessagesBySession.get(channelId);

        Byte[] byteObjectArray = ByteUtils.changePrimitiveByteArrayToByteObjectArray(byteArray);
        byteMessage.addAll(Arrays.asList(byteObjectArray));

        if (message.isLast()) {
            byte[] byteData = ByteUtils.changeByteObjectArrayToPrimitiveByteArray((Byte[]) byteMessage.toArray(new Byte[byteMessage.size()]));

            String userText = audioService.transcribe(byteData);

            ChatMemory chatMemory = chatMemories.get(channelId);
            chatMemory.add(UserMessage.from(userText));

            AiMessage aiMessage = chatService.chat(chatMemory);

            chatMessageService.save(channelId, ChatMessageDto.Command.builder().role(USER).content(userText).build());
            chatMessageService.save(channelId, ChatMessageDto.Command.builder().role(ASSISTANT).content(aiMessage.text()).build());

            roleSwitchChatMessageService.save(channelId, ChatMessageDto.Command.builder().role(ASSISTANT).content(userText).build());
            roleSwitchChatMessageService.save(channelId, ChatMessageDto.Command.builder().role(USER).content(aiMessage.text()).build());

            String voice = voices.get(channelId);

            TTSRequest request = TTSRequest.builder()
                    .input(aiMessage.text())
                    .voice(voice)
                    .response_format("mp3")
                    .build();

            byte[] audioData = audioService.createSpeech(request);

            try {
                BinaryMessage binaryMessage = new BinaryMessage(audioData);

                session.sendMessage(binaryMessage);
            } catch (IOException e) {
                throw new UncheckedIOException("error Sending Audio file to websocket client", e);
            }

            byteMessage.clear();

        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Map<String, Object> attributes = session.getAttributes();
        String channelId = (String) attributes.get("channel_id");
        chatMemories.remove(channelId);
        binaryMessagesBySession.remove(channelId);
        voices.remove(channelId);
        roleSwitchChatMessageService.removeAll(channelId);
        chatMessageService.removeAll(channelId);
    }

    @Override
    public boolean supportsPartialMessages() {
        return true;
    }
}
