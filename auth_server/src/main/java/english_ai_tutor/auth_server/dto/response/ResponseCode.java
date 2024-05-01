package english_ai_tutor.auth_server.dto.response;

import english_ai_tutor.auth_server.exception.ExceptionEnum;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Arrays;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public enum ResponseCode {
    // 400 Bad Request
    BAD_REQUEST(HttpStatus.BAD_REQUEST, false, "잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, false, "토큰이 만료되었습니다.");


    private final HttpStatus httpStatus;
    private final Boolean success;
    private final String message;

    public static ResponseCode toResponseCode(ExceptionEnum exceptionEnum) {
        return Arrays.stream(values())
                .filter(code -> code.getHttpStatus() == exceptionEnum.getHttpStatus())
                .findFirst().get();
    }

    public int getHttpStatusCode(){
        return httpStatus.value();
    }
}
