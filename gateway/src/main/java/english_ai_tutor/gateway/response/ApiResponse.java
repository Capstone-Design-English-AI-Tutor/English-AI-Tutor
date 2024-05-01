package english_ai_tutor.gateway.response;

import english_ai_tutor.gateway.exception.ExceptionEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private ApiHeader header;
    private T data;
    private String message;

    public static <T> ApiResponse<T> fail(ExceptionEnum exceptionEnum) {
        return new ApiResponse<>(new ApiHeader(exceptionEnum.getHttpStatus().value(), exceptionEnum.getMessage()), null, exceptionEnum.getMessage());
    }
}
