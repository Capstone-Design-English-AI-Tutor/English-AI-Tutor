package english_ai_tutor.conversation_service.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Builder;

public class ChatMessageDto {
    @Builder
    public record Command(Role role, String content){
    }
    @Builder
    public record Response(Role role, String content){}
    public enum Role {
        SYSTEM("system"),
        ASSISTANT("assistant"),
        USER("user");

        private String name;

        Role(String name) {
            this.name = name;
        }

        @JsonValue
        public String getName(){
            return this.name;
        }
    }
}
