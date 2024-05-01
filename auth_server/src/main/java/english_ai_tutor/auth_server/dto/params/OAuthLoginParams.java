package english_ai_tutor.auth_server.dto.params;

import english_ai_tutor.auth_server.vo.OAuthProvider;

public interface OAuthLoginParams {
    OAuthProvider getOAuthProvider();
    String getAuthorizationCode();
}
