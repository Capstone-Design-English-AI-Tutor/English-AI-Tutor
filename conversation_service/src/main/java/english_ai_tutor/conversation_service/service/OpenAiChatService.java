package english_ai_tutor.conversation_service.service;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.output.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenAiChatService {
    private final OpenAiChatModel model;
    public AiMessage chat(ChatMemory memory){
        Response<AiMessage> response = model.generate(memory.messages());

        return response.content();
    }

    public String chat(List<ChatMessage> chatMessages){
        return model.generate(chatMessages).content().text();
    }
}
