package english_ai_tutor.auth_server.controller;


import english_ai_tutor.auth_server.dto.params.KakaoLoginParam;
import english_ai_tutor.auth_server.dto.response.ApiResponse;
import english_ai_tutor.auth_server.dto.token.AuthToken;
import english_ai_tutor.auth_server.exception.ApiException;
import english_ai_tutor.auth_server.exception.ExceptionEnum;
import english_ai_tutor.auth_server.service.OAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Slf4j
public class OAuthController {
    private final OAuthService oAuthService;

    @GetMapping("/login/kakao")
    public ResponseEntity<ApiResponse<String>> kakaoLogin(@RequestParam("code") KakaoLoginParam param) {
        log.info("code={}", param.getAuthorizationCode());
        AuthToken authToken = oAuthService.login(param);

        log.info("authToken.getRefresh_token_expires_in={}", authToken.getRefresh_token_expires_in());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", authToken.getRefreshToken())
                .httpOnly(true)
                .maxAge(authToken.getRefresh_token_expires_in())
                .build();


        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(ApiResponse.success(authToken.getAccessToken(), "로그인 성공"));
    }

    // access 토큰 검증 완료를 한 상황
    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@CookieValue(name="refreshToken")String refreshToken){
        if(Boolean.TRUE.equals(oAuthService.logout(refreshToken))){
            ResponseCookie responseCookie = ResponseCookie.from("refreshToken")
                    .httpOnly(true)
                    .maxAge(0)
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                    .body(ApiResponse.success("로그아웃 성공"));
        } else{
            return ResponseEntity.ok()
                    .body(ApiResponse.success("로그아웃 성공"));
        }
    }

    // access 토큰인 만료된 상황
    @GetMapping("/reissue")
    public ResponseEntity<ApiResponse<String>> reissue(@CookieValue(name="refreshToken")String refreshToken){
        if (refreshToken.isEmpty()) {
            throw new ApiException(ExceptionEnum.NOT_FOUND_REFRESH_TOKEN_IN_REQUEST_HEADER);
        }

        String accessToken = oAuthService.reissue(refreshToken);

        return ResponseEntity.ok(ApiResponse.success(accessToken, "access 토큰 재발급 성공"));
    }

    @GetMapping("/hello_world")
    public ResponseEntity<String> hello_world(){
        return ResponseEntity.ok("hello world");
    }
}