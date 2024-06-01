package english_ai_tutor.writing_service.dto;

import lombok.Builder;

import java.util.List;

public class OpenAIEmbeddingDto {
    @Builder
    public record Request(List<String> input, String model){
    }

    @Builder
    public record Request2(String input, String model){
    }

    @Builder
    public record Response(List<Data> data){

    }

    public record Data(List<Double> embedding){

    }
}
