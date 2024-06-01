package english_ai_tutor.article_crawling_service.dto;

import lombok.Builder;

public class DeepLDto {
    @Builder
    public record Request(String english){
    }

    @Builder
    public record Response(String english, String korean){
    }
}
