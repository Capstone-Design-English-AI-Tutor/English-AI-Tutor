package english_ai_tutor.article_crawling_service.exception;

public class S3UploadException extends RuntimeException{
    public S3UploadException() {
    }

    public S3UploadException(String message) {
        super(message);
    }

    public S3UploadException(String message, Throwable cause) {
        super(message, cause);
    }

    public S3UploadException(Throwable cause) {
        super(cause);
    }
}
