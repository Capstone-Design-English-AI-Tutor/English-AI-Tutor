package english_ai_tutor.article_crawling_service.exception;

public class ImageReadException extends RuntimeException{
    public ImageReadException() {
    }

    public ImageReadException(String message) {
        super(message);
    }

    public ImageReadException(String message, Throwable cause) {
        super(message, cause);
    }

    public ImageReadException(Throwable cause) {
        super(cause);
    }
}
