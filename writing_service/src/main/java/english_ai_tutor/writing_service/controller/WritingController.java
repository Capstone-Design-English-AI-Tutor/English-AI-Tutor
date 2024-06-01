package english_ai_tutor.writing_service.controller;

import english_ai_tutor.writing_service.dto.GrammarSpellDto;
import english_ai_tutor.writing_service.dto.NewsDto;
import english_ai_tutor.writing_service.dto.SentenceDto;
import english_ai_tutor.writing_service.dto.SimilarityDto;
import english_ai_tutor.writing_service.service.SaplingAiClient;
import english_ai_tutor.writing_service.service.WritingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/writing")
@RequiredArgsConstructor
public class WritingController {
    private final SaplingAiClient saplingAiClient;
    private final WritingService writingService;
    @PostMapping("/check/grammar-and-spell")
    public ResponseEntity<?> checkGrammarAndSpell(@RequestBody GrammarSpellDto.Request request){

        return ResponseEntity.ok().body(saplingAiClient.checkGrammarAndSpell(request.toCommand()));
    }

    @GetMapping("/news/level/{level}")
    public ResponseEntity<?> getAllNews(@PathVariable Integer level){
        return ResponseEntity.ok().body(writingService.findAllNewsByLevel(
                NewsDto.Command.builder()
                        .level(level)
                        .build()));
    }

    @GetMapping("/news/{newsId}")
    public ResponseEntity<?> getNews(@PathVariable Long newsId){
        return ResponseEntity.ok().body(writingService.findSentence(
                SentenceDto.Command.builder()
                        .newsId(newsId)
                        .build()));
    }

    @GetMapping("/sentence/{sentenceId}")
    public ResponseEntity<?> getAnswer(@PathVariable Long sentenceId){
        return ResponseEntity.ok().body(writingService.findRightEnglish(
                SentenceDto.Command.builder()
                        .sentenceId(sentenceId)
                        .build()));
    }

    @PostMapping("/check/similarity")
    public ResponseEntity<?> checkSimilarity(@RequestBody SimilarityDto.Request request){
        return ResponseEntity.ok().body(writingService.evaluateSemanticSimilarity(request));
    }
}
