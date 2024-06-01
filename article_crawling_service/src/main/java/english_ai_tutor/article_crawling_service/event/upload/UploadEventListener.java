package english_ai_tutor.article_crawling_service.event.upload;

import english_ai_tutor.article_crawling_service.service.S3ImageFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@RequiredArgsConstructor
public class UploadEventListener {
    private final S3ImageFileService s3ImageFileService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void rollbackUploadImage(UploadRollbackEvent event){
        s3ImageFileService.deleteFile(event.filePath());
    }

}
