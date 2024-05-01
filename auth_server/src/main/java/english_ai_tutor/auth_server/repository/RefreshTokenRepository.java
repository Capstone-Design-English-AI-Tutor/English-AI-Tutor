package english_ai_tutor.auth_server.repository;

import english_ai_tutor.auth_server.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

    Optional<RefreshToken> findByEmail(String email);
}
