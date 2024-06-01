package english_ai_tutor.writing_service.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Arrays;
import java.util.function.Function;

public class SimilarityDto {
    @Builder
    public record Request(String userInput, Long sentenceId){
        public Command toCommand(){
            return Command.builder()
                    .userInput(userInput)
                    .sentenceId(sentenceId)
                    .build();
        }
    }
    @Builder
    public record Command(String userInput, Long sentenceId){}

    @Builder
    public record Response(Grade grade){

    }

    @AllArgsConstructor
    public enum Grade{
        BAD("bad", value -> value < 60),
        GOOD("good", value -> value >= 60 && value < 85),
        EXCELLENT("excellent", value -> value >= 85);
        private final String grade;
        private final Function<Double, Boolean> rangeValue;

        @JsonValue
        public String getGrade(){
            return this.grade;
        }

        public static Grade fromValue(double value){
            return Arrays.stream(Grade.values()).filter(g -> g.rangeValue.apply(value)).findFirst().get();
        }
    }


}
