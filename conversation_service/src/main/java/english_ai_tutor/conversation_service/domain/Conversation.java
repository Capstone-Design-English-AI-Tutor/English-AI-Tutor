package english_ai_tutor.conversation_service.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Builder
public class Conversation {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String title;
    String prompt;
    String role_switch_prompt;

    public Conversation(Long id, String title, String prompt, String role_switch_prompt) {
        this.id = id;
        this.title = title;
        this.prompt = prompt;
        this.role_switch_prompt = role_switch_prompt;
    }
}
