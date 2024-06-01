package english_ai_tutor.article_crawling_service.event.upload;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


public record UploadRollbackEvent(String filePath){}
