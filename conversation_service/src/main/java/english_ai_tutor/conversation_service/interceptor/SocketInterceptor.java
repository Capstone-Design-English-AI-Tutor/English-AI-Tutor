package english_ai_tutor.conversation_service.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.UUID;

@Component
public class SocketInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        UriComponents uriComponents = UriComponentsBuilder.fromPath(request.getURI().getPath()).build();
        String channelId = uriComponents.getPathSegments().get(3);

        HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
        String value = servletRequest.getParameter("conversation_id");
        attributes.put("conversation_id", value);
        attributes.put("channel_id", channelId);

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception){
    }
}
