package english_ai_tutor.auth_server.dto.info;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import english_ai_tutor.auth_server.vo.OAuthProvider;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoUserInfo implements OAuthUserInfo{
    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @JsonIgnoreProperties(ignoreUnknown = true)
    record KakaoAccount(String email) {
    }

    @Override
    public String getEmail() {
        return kakaoAccount.email;
    }

    @Override
    public OAuthProvider getOAuthProvider() {
        return OAuthProvider.KAKAO;
    }
}
