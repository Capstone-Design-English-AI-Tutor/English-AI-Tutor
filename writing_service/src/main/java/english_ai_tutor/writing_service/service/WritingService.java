package english_ai_tutor.writing_service.service;

import english_ai_tutor.writing_service.domain.Sentence;
import english_ai_tutor.writing_service.dto.NewsDto;
import english_ai_tutor.writing_service.dto.OpenAIEmbeddingDto;
import english_ai_tutor.writing_service.dto.SentenceDto;
import english_ai_tutor.writing_service.dto.SimilarityDto;
import english_ai_tutor.writing_service.repository.NewsRepository;
import english_ai_tutor.writing_service.repository.SentenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WritingService {
    private final NewsRepository newsRepository;
    private final SentenceRepository sentenceRepository;
    private final OpenAIEmbeddingClient openAIEmbeddingClient;

    @Transactional(readOnly = true)
    public List<NewsDto.Response> findAllNewsByLevel(NewsDto.Command command){
        return newsRepository.findALLByLevel(command.level()).stream()
                .map(news ->
                        NewsDto.Response.builder()
                                .id(news.getId())
                                .s3Url(news.getS3Url())
                                .title(news.getTitle())
                                .level(news.getLevel())
                                .category(news.getCategory())
                                .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SentenceDto.Response> findSentence(SentenceDto.Command command) {
        List<Sentence> sentences = sentenceRepository.findAllByNewsId(command.newsId());

        return sentences.stream().map(s -> SentenceDto.Response.builder()
                .sentenceId(s.getId())
                .korean(s.getKorean())
                .build()).toList();
    }
    @Transactional(readOnly = true)
    public SentenceDto.Response findRightEnglish(SentenceDto.Command command){
        Sentence sentence = sentenceRepository.findById(command.sentenceId()).get();

        return SentenceDto.Response.builder().english(sentence.getEnglish()).build();
    }

    @Transactional(readOnly = true)
    public SimilarityDto.Response evaluateSemanticSimilarity(SimilarityDto.Request request){
        Sentence sentence = sentenceRepository.findById(request.sentenceId()).get();

        Double cosineSimilarity = calcCosineSimilarity(request.userInput(), sentence.getEnglish());

        return SimilarityDto.Response.builder()
                .grade(SimilarityDto.Grade.fromValue(cosineSimilarity * 100))
                .build();
    }
    private Double calcCosineSimilarity(String userInput, String answer){
        OpenAIEmbeddingDto.Response response = openAIEmbeddingClient.embedding(userInput, answer);

        List<OpenAIEmbeddingDto.Data> data = response.data();

        List<Double> userEmbedding = data.get(0).embedding();
        List<Double> answerEmbedding = data.get(1).embedding();

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < userEmbedding.size(); i++) {
            dotProduct += userEmbedding.get(i) * answerEmbedding.get(i);
            normA += Math.pow(userEmbedding.get(i), 2);
            normB += Math.pow(answerEmbedding.get(i), 2);
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
