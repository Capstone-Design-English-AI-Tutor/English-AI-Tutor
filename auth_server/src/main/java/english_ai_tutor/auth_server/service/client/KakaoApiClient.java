package english_ai_tutor.auth_server.service.client;

import english_ai_tutor.auth_server.vo.KakaoToken;
import english_ai_tutor.auth_server.vo.OAuthConstant;
import english_ai_tutor.auth_server.vo.OAuthProvider;
import english_ai_tutor.auth_server.dto.info.KakaoUserInfo;
import english_ai_tutor.auth_server.dto.info.OAuthUserInfo;
import english_ai_tutor.auth_server.dto.params.OAuthLoginParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class KakaoApiClient implements OAuthClient {
    @Value("${oauth.kakao.url.auth}")
    private String authUrl;
    @Value("${oauth.kakao.url.api}")
    private String apiUrl;
    @Value("${oauth.kakao.client-id}")
    private String clientId;
    @Value("${oauth.kakao.secret-id}")
    private String secretId;
    @Value("${oauth.kakao.redirect_uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    @Override
    public OAuthProvider oAuthProvider() {
        return OAuthProvider.KAKAO;
    }

    @Override
    public String requestAccessToken(OAuthLoginParams params) {
        String url = authUrl + "/oauth/token";

        HttpEntity<MultiValueMap<String, String>> request = generateRequestOfAccessToken(params);

        KakaoToken kakaoToken = restTemplate.postForObject(url, request, KakaoToken.class);

        log.info("response = {}", kakaoToken);
        Objects.requireNonNull(kakaoToken);

        return kakaoToken.accessToken();
    }

    private HttpEntity<MultiValueMap<String, String>> generateRequestOfAccessToken(OAuthLoginParams params) {
        HttpHeaders requestHeader = new HttpHeaders();
        requestHeader.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();

        log.info("authorization_code = {}", params.getAuthorizationCode());
        requestParams.add("code", params.getAuthorizationCode());
        requestParams.add("grant_type", OAuthConstant.GRANT_TYPE);
        requestParams.add("client_id", clientId);
        requestParams.add("client_secret", secretId);
        requestParams.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestParams, requestHeader);
        return request;
    }

    @Override
    public OAuthUserInfo requestOAuthInfo(String accessToken) {
        String url = apiUrl + "/v2/user/me";

        HttpEntity<?> request = generateRequestOfOAuthInfo(accessToken);
        log.info("request header = {}, body= {}", request.getHeaders(), request.getBody());

        KakaoUserInfo kakaoUserInfo = restTemplate.postForObject(url, request, KakaoUserInfo.class);

        return kakaoUserInfo;
    }

    private static HttpEntity<?> generateRequestOfOAuthInfo(String accessToken) {
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String requestToken = "Bearer " + accessToken;
        httpHeaders.set("Authorization", requestToken);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("property_keys", "[\"kakao_account.email\"]");
        HttpEntity<?> request = new HttpEntity<>(body, httpHeaders);
        return request;
    }

}
