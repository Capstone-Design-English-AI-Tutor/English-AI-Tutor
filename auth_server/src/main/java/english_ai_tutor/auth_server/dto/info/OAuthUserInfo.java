package english_ai_tutor.auth_server.dto.info;

import english_ai_tutor.auth_server.vo.OAuthProvider;

public interface OAuthUserInfo {
    String getEmail();
    OAuthProvider getOAuthProvider();
}
