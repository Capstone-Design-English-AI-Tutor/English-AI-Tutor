package english_ai_tutor.conversation_service.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import english_ai_tutor.conversation_service.dto.ChatMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoleSwitchChatMessageRepository {
    private final RedisTemplate<String, String> redisTemplate;
    private final ListOperations<String, String> operations;
    private final ObjectMapper objectMapper;
    private static final String KEY_PREFIX = "role_switch_chat_message:";

    @Autowired
    public RoleSwitchChatMessageRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.operations = redisTemplate.opsForList();
        this.objectMapper = new ObjectMapper();
    }

    public void save(String sessionId, ChatMessageDto.Command command){
        String key = KEY_PREFIX + sessionId;
        String jsonValue = null;
        try {
            jsonValue = objectMapper.writeValueAsString(command);
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
        }

        operations.rightPush(key, jsonValue);
    }

    public List<ChatMessageDto.Response> findAll(String sessionId){
        String key = KEY_PREFIX + sessionId;

        List<String> jsonValues = operations.range(key, 0, -1);

        return jsonValues.stream().map(jsonValue -> {
            try {
                return objectMapper.readValue(jsonValue, ChatMessageDto.Response.class);
            } catch (JsonProcessingException e) {
                System.out.println(e.getMessage());
            }
            return null;
        }).toList();
    }

    public void removeAll(String sessionId){
        String key = KEY_PREFIX + sessionId;
        redisTemplate.delete(key);
    }
}
