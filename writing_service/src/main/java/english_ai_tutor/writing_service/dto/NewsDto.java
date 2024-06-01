package english_ai_tutor.writing_service.dto;

import lombok.Builder;
import lombok.Getter;


public class NewsDto {
    @Builder
    public record Command(Integer level){}

    @Builder
    public record Response(Long id, String title, String s3Url, Integer level, String category){
    }
}
