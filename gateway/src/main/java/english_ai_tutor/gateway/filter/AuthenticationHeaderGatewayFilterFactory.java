package english_ai_tutor.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import english_ai_tutor.gateway.exception.ExceptionEnum;
import english_ai_tutor.gateway.response.ApiResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
@Slf4j
public class AuthenticationHeaderGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthenticationHeaderGatewayFilterFactory.Config> {
    private ObjectMapper objectMapper = new ObjectMapper();
    private Key key;

    public AuthenticationHeaderGatewayFilterFactory(@Value("${spring.jwt.secret}") String secretKey) {
        super(Config.class);
        this.key = key = Keys.hmacShaKeyFor(Base64.getEncoder().encodeToString(secretKey.getBytes()).getBytes());
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().toString();

            if (path.startsWith("/auth/login") || path.startsWith("/auth/reissue")) {
                return chain.filter(exchange);
            }

            if(!containsAuthorization(request)){
                return onError(exchange, ExceptionEnum.NOT_FOUND_AUTHORIZATION_HEADER_IN_REQUEST, HttpStatus.UNAUTHORIZED);
            }
            String accessToken = extract(request);

            if (!isValid(accessToken)){
                return onError(exchange, ExceptionEnum.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            return chain.filter(exchange);
        };
    }


    private Mono<Void> onError(ServerWebExchange exchange, ExceptionEnum exception, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();

        byte[] responseBytes = toBytes(ApiResponse.fail(exception));
        DataBuffer buffer = response.bufferFactory().wrap(responseBytes);
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        return response.writeWith(Mono.just(buffer));
    }

    private byte[] toBytes(ApiResponse<Object> apiResponse) {
        String json = null;
        try {
            json = objectMapper.writeValueAsString(apiResponse);
            return json.getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            log.error("json 처리 에러");
            return new byte[0];
        }
    }

    private boolean isValid(String accessToken) {
        try{
            log.info("access_token = {}");
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken);
            return !claims.getBody().getExpiration().before(new Date());
        }
        catch(SignatureException e){
            log.error("서명 오류");
            return false;
        }
        catch(ExpiredJwtException e){
            log.error("만료된 토큰");
            return false;
        }catch(Exception e){
            e.printStackTrace();
            log.error("그 외 에러");
            return false;
        }
    }
    private String extract(ServerHttpRequest request) {
        return request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0).substring(7);
    }

    private boolean containsAuthorization(ServerHttpRequest request) {
        return request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION);
    }

    static class Config{
    }

}
