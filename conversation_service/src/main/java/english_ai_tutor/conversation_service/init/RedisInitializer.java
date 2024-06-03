package english_ai_tutor.conversation_service.init;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Component
public class RedisInitializer {
    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostConstruct
    public void init(){
        Set<String> keys = redisTemplate.keys("*");
        if(keys != null) redisTemplate.delete(keys);
        log.info("Redis DB 초기화");
    }
}
