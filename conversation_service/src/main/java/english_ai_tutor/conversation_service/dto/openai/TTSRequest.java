package english_ai_tutor.conversation_service.dto.openai;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class TTSRequest {
    @Builder.Default private String model = "tts-1" ;
    private String input;
    private String voice;
    private String response_format;

    public TTSRequest(String model, String input, String voice, String response_format) {
        this.model = model;
        this.input = input;
        this.voice = voice;
        this.response_format = response_format;
    }
}


