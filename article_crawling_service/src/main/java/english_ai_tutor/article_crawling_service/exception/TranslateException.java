package english_ai_tutor.article_crawling_service.exception;

public class TranslateException extends RuntimeException{
    public TranslateException() {
    }

    public TranslateException(String message) {
        super(message);
    }

    public TranslateException(String message, Throwable cause) {
        super(message, cause);
    }

    public TranslateException(Throwable cause) {
        super(cause);
    }
}
