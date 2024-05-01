package english_ai_tutor.auth_server.dto.params;

import english_ai_tutor.auth_server.vo.OAuthProvider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KakaoLoginParam implements OAuthLoginParams {
    private String authorizationCode;

    @Override
    public OAuthProvider getOAuthProvider() {
        return OAuthProvider.KAKAO;
    }

}
