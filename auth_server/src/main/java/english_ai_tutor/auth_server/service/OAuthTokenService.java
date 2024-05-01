package english_ai_tutor.auth_server.service;

import english_ai_tutor.auth_server.domain.RefreshToken;
import english_ai_tutor.auth_server.dto.token.AuthToken;
import english_ai_tutor.auth_server.exception.ApiException;
import english_ai_tutor.auth_server.exception.ExceptionEnum;
import english_ai_tutor.auth_server.repository.RefreshTokenRepository;
import english_ai_tutor.auth_server.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthTokenService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthToken generateToken(Long userId, String email) {
        AuthToken authToken = jwtTokenProvider.generateAuthToken(email);

        saveRefreshToken(userId, email, authToken.getRefreshToken());

        return authToken;
    }
    public Boolean removeToken(String token){
        return refreshTokenRepository.findByRefreshToken(token).map(refreshToken -> {
            refreshTokenRepository.delete(refreshToken);
            return true;
        }).orElse(false);
    }

    public String regenerateToken(String refreshToken){
        // 검색 & 비교
        String email = jwtTokenProvider.resolveToken(refreshToken);
        refreshTokenRepository.findByEmail(email).orElseThrow(() -> new ApiException(ExceptionEnum.INVALID_REFRESH_TOKEN));

        return jwtTokenProvider.generateAccessToken(email);
    }

    private void saveRefreshToken(Long userId, String email, String refreshToken) {
        RefreshToken token = RefreshToken.builder()
                .userId(userId)
                .refreshToken(refreshToken)
                .email(email)
                .build();

        refreshTokenRepository.save(token);
    }
}
