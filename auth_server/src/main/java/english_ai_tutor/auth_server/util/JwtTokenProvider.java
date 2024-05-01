package english_ai_tutor.auth_server.util;

import english_ai_tutor.auth_server.dto.token.AuthToken;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {
    private final Long ACCESS_TOKEN_EXPIRES_IN = 60 * 10 * 1000L;
    private final Long REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 1000L;

    private Key key;

    public JwtTokenProvider(@Value("${spring.jwt.secret}") String secretKey) {
        log.info("[init] JwtTokenProvider 내 secretKey 초기화 시작");
        key = Keys.hmacShaKeyFor(Base64.getEncoder().encodeToString(secretKey.getBytes()).getBytes());

        log.info("[init] JwtTokenProvider 내 SecretKey 초기화 완료");
    }

    public String generateAccessToken(String email){
        Date now = new Date();

        return Jwts.builder()
                .setHeaderParam("typ", "access_token")
                .setHeaderParam("alg", "HS256")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRES_IN))
                .claim("email", email)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public AuthToken generateAuthToken(String email){
        Date now = new Date();

        String accessToken = Jwts.builder()
                .setHeaderParam("typ", "access_token")
                .setHeaderParam("alg", "HS256")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRES_IN))
                .claim("email", email)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        String refreshToken = Jwts.builder()
                .setHeaderParam("typ", "refresh_token")
                .setHeaderParam("alg", "HS256")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRES_IN))
                .claim("email", email)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return AuthToken.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expires_in(REFRESH_TOKEN_EXPIRES_IN)
                .build();
    }

    public String resolveToken(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
    }
}
