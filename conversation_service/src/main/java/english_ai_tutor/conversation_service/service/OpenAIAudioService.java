package english_ai_tutor.conversation_service.service;

import english_ai_tutor.conversation_service.dto.openai.STTResponse;
import english_ai_tutor.conversation_service.dto.openai.TTSRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;


@Service
@RequiredArgsConstructor
public class OpenAIAudioService {
    private static final String BASE_URL = "https://api.openai.com/";
    private static final String TTS_PATH = "v1/audio/speech";
    private static final String SST_PATH = "v1/audio/transcriptions";

    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;

    public byte[] createSpeech(TTSRequest ttsRequest){
        return RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + OPENAI_API_KEY)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .uri(TTS_PATH)
                .body(ttsRequest)
                .retrieve().body(byte[].class);
    }

    public String transcribe(byte[] fileData){
        System.out.println(Arrays.toString(fileData));
        MultiValueMap<String, Object> requestData = new LinkedMultiValueMap<>();
        requestData.add("model", "whisper-1");
        requestData.add("file", new ByteArrayResource(fileData){
            @Override
            public String getFilename() {
                return "temp.mp3";
            }
        });

        return RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + OPENAI_API_KEY)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
                .build()
                .post()
                .uri(SST_PATH)
                .body(requestData)
                .retrieve().body(STTResponse.class).text();
    }
}
