package english_ai_tutor.auth_server.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException{
    private ExceptionEnum error;

    public ApiException(ExceptionEnum error){
        super(error.getMessage());
        this.error = error;
    }
}
