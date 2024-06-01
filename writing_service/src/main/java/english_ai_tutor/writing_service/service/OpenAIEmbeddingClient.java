package english_ai_tutor.writing_service.service;

import english_ai_tutor.writing_service.dto.OpenAIEmbeddingDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAIEmbeddingClient {
    @Value("${openai.api.key}")
    private String key;
    private static final String BASE_URL = "https://api.openai.com";
    private static final String TEXT_EMBEDDING_SMALL_MODEL = "text-embedding-3-small";

    public OpenAIEmbeddingDto.Response embedding(String userInput, String answerInput){
        List<String> input = new ArrayList<>();
        input.add(userInput);
        input.add(answerInput);

        OpenAIEmbeddingDto.Request request = OpenAIEmbeddingDto.Request.builder()
                .input(input)
                .model(TEXT_EMBEDDING_SMALL_MODEL)
                .build();

        OpenAIEmbeddingDto.Response response = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + key)
                .build()
                .post()
                .uri("/v1/embeddings")
                .body(request)
                .retrieve()
                .toEntity(OpenAIEmbeddingDto.Response.class)
                .getBody();

        return response;
    }


}
