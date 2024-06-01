package english_ai_tutor.writing_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;


public class SentenceDto {
    @Builder
    public record Command(Long sentenceId, Long newsId){
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder
    public record Response(Long sentenceId, String korean, String english){
    }
}
