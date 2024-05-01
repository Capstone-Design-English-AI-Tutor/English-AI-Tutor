package english_ai_tutor.auth_server.dto.token;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AuthToken {
    private String accessToken;
    private String refreshToken;
    private Long refresh_token_expires_in;

    @Builder
    public AuthToken(String accessToken, String refreshToken, Long expires_in) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.refresh_token_expires_in = expires_in;
    }
}
