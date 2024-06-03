package english_ai_tutor.conversation_service.service;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import english_ai_tutor.conversation_service.dto.ChatMessageDto;
import english_ai_tutor.conversation_service.repository.RoleSwitchChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleSwitchChatMessageService {
    private final RoleSwitchChatMessageRepository roleSwitchChatMessageRepository;
    private final OpenAiChatService openAiChatService;
    @Transactional
    public void save(String channelId, ChatMessageDto.Command command){
        roleSwitchChatMessageRepository.save(channelId, command);
    }
    @Transactional
    public String help(String channelId){
        List<ChatMessageDto.Response> response = roleSwitchChatMessageRepository.findAll(channelId);
        List<ChatMessage> chatMessages = toChatMessageList(response);

        return openAiChatService.chat(chatMessages);
    }

    @Transactional
    public void removeAll(String channelId){
        roleSwitchChatMessageRepository.removeAll(channelId);
    }
    private List<ChatMessage> toChatMessageList(List<ChatMessageDto.Response> chatMessageDtoList){
        return chatMessageDtoList.stream().map(chatMessageDto -> {
            return (ChatMessage) switch (chatMessageDto.role()) {
                case SYSTEM -> SystemMessage.from(chatMessageDto.content());
                case ASSISTANT -> AiMessage.from(chatMessageDto.content());
                case USER -> UserMessage.from(chatMessageDto.content());
            };
        }).toList();
    }


}
