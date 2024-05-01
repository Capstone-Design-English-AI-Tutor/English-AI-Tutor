package english_ai_tutor.auth_server.controller;

import english_ai_tutor.auth_server.dto.response.ApiResponse;
import english_ai_tutor.auth_server.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class OAuthControllerAdvice {

    public ResponseEntity<ApiResponse<?>> handleException(ApiException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.fail(exception.getError()));
    }
}
