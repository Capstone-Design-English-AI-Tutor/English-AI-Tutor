package english_ai_tutor.article_crawling_service.service;

import com.deepl.api.DeepLException;
import com.deepl.api.TextResult;
import com.deepl.api.Translator;
import com.deepl.api.TranslatorOptions;
import english_ai_tutor.article_crawling_service.dto.DeepLDto;
import english_ai_tutor.article_crawling_service.exception.TranslateException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranslationService {
    private Translator translator;

    public TranslationService(@Value("${deepl.api.key}") String key) {
        translator = new Translator(key);
    }

    public List<DeepLDto.Response> translate(List<DeepLDto.Request> requests){
        return requests.stream().map(request -> {
            String korean = null;
            String english = request.english();
            try {
                korean = translator.translateText(english, null, "KO").getText();
                return DeepLDto.Response.builder().english(english).korean(korean).build();
            } catch (DeepLException | InterruptedException e) {
                throw new TranslateException("번역하는 과정이 오류가 생겼습니다.");
            }
        }).toList();
    }


}
