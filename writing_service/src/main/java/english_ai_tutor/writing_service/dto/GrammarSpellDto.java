package english_ai_tutor.writing_service.dto;

import lombok.Builder;

import java.util.List;

public class GrammarSpellDto {
    @Builder
    public record Request(String input){
        public Command toCommand(){
            return Command.builder()
                    .input(input)
                    .build();
        }
    }
    @Builder
    public record Command(String input){

    }
    @Builder
    public record Response(List<GrammarSpellResult> result){

    }
    @Builder
    public record GrammarSpellResult(SaplingDto.GeneralErrorType error, SaplingDto.ErrorType error_message, Integer startIdx, Integer endIdx, String replacement){

    }
}
