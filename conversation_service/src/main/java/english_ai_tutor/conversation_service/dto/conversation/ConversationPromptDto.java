package english_ai_tutor.conversation_service.dto.conversation;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class ConversationPromptDto {
    private String prompt;
    private String roleSwitchPrompt;

    public ConversationPromptDto(String prompt, String roleSwitchPrompt) {
        this.prompt = prompt;
        this.roleSwitchPrompt = roleSwitchPrompt;
    }
}
