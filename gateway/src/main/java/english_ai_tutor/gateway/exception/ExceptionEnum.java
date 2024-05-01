package english_ai_tutor.gateway.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionEnum {
    NOT_FOUND_AUTHORIZATION_HEADER_IN_REQUEST(HttpStatus.UNAUTHORIZED, "요청에 Authorization 헤더가 없습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다.");

    private HttpStatus httpStatus;
    private String message;

    ExceptionEnum(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
