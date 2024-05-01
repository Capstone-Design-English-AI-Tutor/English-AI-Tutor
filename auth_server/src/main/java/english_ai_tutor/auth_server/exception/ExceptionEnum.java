package english_ai_tutor.auth_server.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionEnum {
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "대응되는 refresh token이 없습니다."),
    NOT_FOUND_REFRESH_TOKEN_IN_REQUEST_HEADER(HttpStatus.UNAUTHORIZED, "요청에 refresh token이 없습니다.");

    private HttpStatus httpStatus;
    private String message;

    ExceptionEnum(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
