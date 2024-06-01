package english_ai_tutor.writing_service.service;

import english_ai_tutor.writing_service.dto.GrammarSpellDto;
import english_ai_tutor.writing_service.dto.SaplingDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

@Service
public class SaplingAiClient {
    @Value("${sapling.api.key}")
    private String key;
    private static final String SESSION_ID = "SESSION_ID";
    private static final String BASE_URL = "https://api.sapling.ai";
    public GrammarSpellDto.Response checkGrammarAndSpell(GrammarSpellDto.Command command){
        SaplingDto.Request request = SaplingDto.Request.builder()
                .key(key)
                .text(command.input())
                .session_id(SESSION_ID)
                .build();

        ResponseEntity<SaplingDto.Response> response = RestClient.builder()
                .baseUrl(BASE_URL)
                .build()
                .post()
                .uri("/api/v1/edits")
                .body(request)
                .retrieve()
                .toEntity(SaplingDto.Response.class);

        List<GrammarSpellDto.GrammarSpellResult> grammarSpellResults = response.getBody().edits().stream().map(
                edit -> GrammarSpellDto.GrammarSpellResult.builder()
                        .error(edit.general_error_type())
                        .error_message(edit.error_type())
                        .startIdx(edit.start())
                        .endIdx(edit.end())
                        .replacement(edit.replacement())
                        .build()
        ).toList();
        return GrammarSpellDto.Response.builder().result(grammarSpellResults).build();
    }
}
