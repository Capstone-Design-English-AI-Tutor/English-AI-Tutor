package english_ai_tutor.auth_server.dto.response;

import english_ai_tutor.auth_server.exception.ExceptionEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ApiResponse<T> {
    private ApiHeader header;
    private T data;
    private String message;

    private static final int SUCCESS = 200;

    public ApiResponse(ApiHeader header, T data, String message) {
        this.header = header;
        this.data = data;
        this.message = message;
    }

    public static <T> ApiResponse<T> success(String message){
        return new ApiResponse<>(new ApiHeader(SUCCESS, "SUCCESS"), null, message);
    }
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(new ApiHeader(SUCCESS, "SUCCESS"), data, message);
    }


    public static <T> ApiResponse<T> fail(ExceptionEnum exceptionEnum) {
        ResponseCode responseCode = ResponseCode.toResponseCode(exceptionEnum);
        return new ApiResponse<>(new ApiHeader(responseCode.getHttpStatusCode(), responseCode.getMessage()), null, responseCode.getMessage());
    }
    public static <T> ApiResponse<T> fail(ResponseCode responseCode, T data) {
        return new ApiResponse<>(new ApiHeader(responseCode.getHttpStatusCode(), responseCode.getMessage()), data, responseCode.getMessage());
    }
}
