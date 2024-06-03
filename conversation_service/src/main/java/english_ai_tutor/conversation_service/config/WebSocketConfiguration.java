package english_ai_tutor.conversation_service.config;

import english_ai_tutor.conversation_service.handler.ChatWebSocketHandler;
import english_ai_tutor.conversation_service.interceptor.SocketInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {
    private SocketInterceptor socketInterceptor;
    private ChatWebSocketHandler chatWebSocketHandler;

    @Autowired
    public WebSocketConfiguration(SocketInterceptor socketInterceptor, ChatWebSocketHandler chatWebSocketHandler) {
        this.socketInterceptor = socketInterceptor;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/api/conversation/websocket/{channelId}")
                .setAllowedOrigins("*")
                .addInterceptors(socketInterceptor);
    }

}
