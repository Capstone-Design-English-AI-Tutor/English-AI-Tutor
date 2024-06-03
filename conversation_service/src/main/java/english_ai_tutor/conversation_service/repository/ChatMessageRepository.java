package english_ai_tutor.conversation_service.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import english_ai_tutor.conversation_service.dto.ChatMessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
public class ChatMessageRepository {
    private final RedisTemplate<String, String> redisTemplate;
    private final ListOperations<String, String> listOperations;
    private final ObjectMapper objectMapper;
    private static final String KEY_PREFIX = "chat_message:";

    @Autowired
    public ChatMessageRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.listOperations = redisTemplate.opsForList();;
        this.objectMapper = new ObjectMapper();
    }

    public void save(String sessionId, ChatMessageDto.Command command){
        String key = KEY_PREFIX + sessionId;
        String jsonData = null;
        try {
            jsonData = objectMapper.writeValueAsString(command);
        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
        listOperations.rightPush(key, jsonData);
    }

    public List<ChatMessageDto.Response> findAll(String sessionId){
        String key = KEY_PREFIX + sessionId;

        List<String> jsonValues = listOperations.range(key, 0, -1);

        return jsonValues.stream().map(jsonValue -> {
            try {
                return objectMapper.readValue(jsonValue, ChatMessageDto.Response.class);
            } catch (JsonProcessingException e) {
                log.error(e.getMessage());
            }
            return null;
        }).toList();
    }

    public void removeAll(String sessionId){
        String key = KEY_PREFIX + sessionId;
        redisTemplate.delete(key);
    }
}
