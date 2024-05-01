package english_ai_tutor.auth_server.service.client;

import english_ai_tutor.auth_server.vo.OAuthProvider;
import english_ai_tutor.auth_server.dto.info.OAuthUserInfo;
import english_ai_tutor.auth_server.dto.params.OAuthLoginParams;

public interface OAuthClient {
    OAuthProvider oAuthProvider();

    String requestAccessToken(OAuthLoginParams params);

    OAuthUserInfo requestOAuthInfo(String accessToken);
}
