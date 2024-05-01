package english_ai_tutor.auth_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiHeader {
    private int code;
    private String message;
}
