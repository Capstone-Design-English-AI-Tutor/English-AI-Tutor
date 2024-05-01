package english_ai_tutor.auth_server.service;

import english_ai_tutor.auth_server.domain.User;
import english_ai_tutor.auth_server.dto.info.OAuthUserInfo;
import english_ai_tutor.auth_server.dto.params.OAuthLoginParams;
import english_ai_tutor.auth_server.dto.token.AuthToken;
import english_ai_tutor.auth_server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuthService {
    private final OAuthRequestProcessService oAuthRequestProcessService;
    private final OAuthTokenService oAuthTokenService;
    private final UserRepository userRepository;
    @Transactional
    public AuthToken login(OAuthLoginParams params) {
        OAuthUserInfo userInfo = oAuthRequestProcessService.process(params);
        Long userId = findUser(userInfo);
        AuthToken authToken = oAuthTokenService.generateToken(userId, userInfo.getEmail());

        return authToken;
    }

    @Transactional
    public Boolean logout(String refreshToken){
        return oAuthTokenService.removeToken(refreshToken);
    }

    @Transactional
    public String reissue(String refreshToken){
        return oAuthTokenService.regenerateToken(refreshToken);
    }
    private Long findUser(OAuthUserInfo userInfo){
        // 이미 등록된 사용자인지 확인
        return userRepository.findUserByEmail(userInfo.getEmail())
                .map(User::getId)
                .orElseGet(() -> createUser(userInfo));
    }

    private Long createUser(OAuthUserInfo userInfo) {
        User user = User.builder()
                .email(userInfo.getEmail())
                .provider(userInfo.getOAuthProvider())
                .build();
        userRepository.save(user);

        return user.getId();
    }
}
