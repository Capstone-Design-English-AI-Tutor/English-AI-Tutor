package english_ai_tutor.conversation_service.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAiConfig {
    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Bean
    public OpenAiChatModel openAiChatModel(){
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName("gpt-4o")
                .maxTokens(100)
                .build();
    }


}
