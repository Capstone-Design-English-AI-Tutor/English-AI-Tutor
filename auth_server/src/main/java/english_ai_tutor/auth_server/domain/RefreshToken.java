package english_ai_tutor.auth_server.domain;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@NoArgsConstructor
@RedisHash(value="refresh_token", timeToLive = 60 * 60 * 1)
public class RefreshToken{
    @Id
    private String email;
    @Indexed
    private String refreshToken;
    private Long userId;

    @Builder
    public RefreshToken(String refreshToken, Long userId, String email) {
        this.refreshToken = refreshToken;
        this.email = email;
        this.userId = userId;
    }
}
