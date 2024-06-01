package english_ai_tutor.writing_service.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Builder;

import java.util.Arrays;
import java.util.List;

public class SaplingDto {
    @Builder
    public record Request(String key, String text, String session_id){
    }
    public record Response(List<Edit> edits){
    }
    public record Edit(Integer start, Integer end, String replacement, ErrorType error_type, GeneralErrorType general_error_type){
    }
    public enum GeneralErrorType{
        GRAMMAR("Grammar"),
        SPELLING("Spelling"),
        PUNCTUATION("Punctuation");

        private String name;

        GeneralErrorType(String name) {
            this.name = name;
        }

        @JsonCreator
        public static GeneralErrorType of(String error){
            return Arrays.stream(GeneralErrorType.values())
                    .filter(g -> g.name.equals(error))
                    .findAny()
                    .orElse(null);
        }
    }
    public enum ErrorType{
        MISSING_PARTICLE("M:PART", "불변화사나 소사(동사와 함께 구동사를 이루는 부사나 전치사)가 없습니다."),
        MISSING_PUNCTUATION("M:PUNCT", "구두점이 없습니다"),
        MISSING_CONJUNCTION("M:CONJ", "접속사가 없습니다."),
        MISSING_DETERMINER("M:DET","한정사(관사, 지시형용사, 소유형용사 등)가 없습니다."),
        MISSING_ARTICLE("M:DET:ART","관사가 없습니다."),
        MISSING_PREPOSITION("M:PREP","전치사가 없습니다."),
        MISSING_PRONOUN("M:PRON","대명사가 없습니다."),
        MISSING_VERB("M:VERB","동사가 없습니다."),
        MISSING_ADJECTIVE("M:ADJ","형용사가 없습니다."),
        MISSING_NOUN("M:NOUN", "명사가 없습니다."),
        MISSING_POSSESSIVE_NOUN("M:NOUN:POSS","소유격이 업습니다."),
        MISSING_OTHER_ELEMENTS("M:OTHER","다른 요소가 필요합니다."),
        INCORRECT_PARTICLE("R:PART","불변화사나 소사(동사 함께 구동사를 이루는 부사나 전치사)가 잘못됐습니다."),
        INCORRECT_PUNCTUATION("R:PUNCT", "구두점이 잘못됐습니다."),
        INCORRECT_ORTHOGRAPHY("R:ORTH","맞춤법이 잘못됐습니다."),
        INCORRECT_SPELLING("R:SPELL","철자가 잘못됐습니다."),
        INCORRECT_WORD_ORDER("R:WO","단어 순서가 잘못됐습니다."),
        INCORRECT_WORD_FORM("R:MORPH","단어 형태가 잘못됐습니다."),
        INCORRECT_ADVERB("R:ADV","부사가 잘못됐습니다."),
        INCORRECT_CONTRACTION("R:CONTR","축약이 잘못됐습니다."),
        INCORRECT_CONJUNCTION("R:CONJ","접속사가 잘못됐습니다."),
        INCORRECT_DETERMINER("R:DET", "한정사(관사, 지시형용사, 소유형용사 등)가 잘못됐습니다."),
        INCORRECT_ARTICLE("R:DET:ART","관사가 잘못됐습니다."),
        INCORRECT_PREPOSITION("R:PREP","전치사가 잘못됐습니다."),
        INCORRECT_PRONOUN("R:PRON" ,"대명사가 잘못됐습니다."),
        INCORRECT_VERB_FORM("R:VERB:FORM", "동사 형태가 잘못됐습니다."),
        INCORRECT_VERB_TENSE("R:VERB:TENSE", "동사 시제가 잘못됐습니다."),
        INCORRECT_SUBJECT_VERB_AGREEMENT("R:VERB:SVA", "주어와 동사가 일치하지 않습니다."),
        INCORRECT_ADJECTIVE_FORM("R:ADJ:FORM", "형용사 형태가 잘못됐습니다."),
        INCORRECT_NOUN_INFLECTION("R:NOUN:INFL","명사의 어형 변화가 잘못됐습니다."),
        INCORRECT_NOUN_NUMBER("R:NOUN:NUM", "명사의 수가 잘못됐습니다."),
        INCORRECT_OTHER("R:OTHER", "잘못된 점이 여러 군데 입니다."),
        UNNECESSARY_PARTICLE("U:PART", "불필요한 불변화사나 소사(동사와 함께 구동사를 이루는 부사나 전치사) 입니다"),
        UNNECESSARY_PUNCTUATION("U:PUNCT", "불필요한 구두점입니다."),
        UNNECESSARY_ADVERB("U:ADV","불필요한 부사입니다."),
        UNNECESSARY_CONTRACTION("U:CONTR","불필요한 축약입니다."),
        UNNECESSARY_CONJUNCTION("U:CONJ", "불필요한 접속사입니다."),
        UNNECESSARY_DETERMINER("U:DET","불필요한 한정사(관사, 지시형용사, 소유형용사 등) 입니다."),
        UNNECESSARY_ARTICLE("U:DET:ART","불필요한 관사입니다."),
        UNNECESSARY_PREPOSITION("U:PREP","불필요한 전치사입니다."),
        UNNECESSARY_PRONOUN("U:PRON", "불필요한 대명사입니다."),
        UNNECESSARY_VERB("U:VERB", "불필요한 동사입니다."),
        UNNECESSARY_ADJECTIVE("U:ADJ", "불필요한 형용사입니다."),
        UNNECESSARY_NOUN("U:NOUN", "불필요한 명사입니다."),
        UNNECESSARY_POSSESSIVE_NOUN("U:NOUN:POSS", "불필요한 소유격입니다."),
        UNNECESSARY_TEXT("U:OTHER", "불필요한 텍스트입니다.");

        private String code;
        private String message;

        ErrorType(String code, String message) {
            this.code = code;
            this.message = message;
        }

        @JsonValue
        public String getMessage(){
            return message;
        }

        @JsonCreator
        public static ErrorType of(String errorType){
            return Arrays.stream(ErrorType.values())
                    .filter(g -> g.code.equals(errorType))
                    .findAny()
                    .orElse(null);
        }
    }
}
