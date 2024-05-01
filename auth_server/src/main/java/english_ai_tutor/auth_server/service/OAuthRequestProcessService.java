package english_ai_tutor.auth_server.service;

import english_ai_tutor.auth_server.vo.OAuthProvider;
import english_ai_tutor.auth_server.dto.info.OAuthUserInfo;
import english_ai_tutor.auth_server.dto.params.OAuthLoginParams;
import english_ai_tutor.auth_server.service.client.OAuthClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OAuthRequestProcessService {
    private final Map<OAuthProvider, OAuthClient> clients;

    public OAuthRequestProcessService(List<OAuthClient> clients) {
        this.clients = clients.stream().collect(Collectors.toUnmodifiableMap(OAuthClient::oAuthProvider, Function.identity()));
    }

    public OAuthUserInfo process(OAuthLoginParams params) {
        OAuthClient client = clients.get(params.getOAuthProvider());
        String accessToken = client.requestAccessToken(params);
        return client.requestOAuthInfo(accessToken);
    }
}
