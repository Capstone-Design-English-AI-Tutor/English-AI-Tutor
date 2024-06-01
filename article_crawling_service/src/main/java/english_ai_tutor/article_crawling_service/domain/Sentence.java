package english_ai_tutor.article_crawling_service.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Sentence {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "korean_sentence", columnDefinition = "TEXT")
    private String korean;

    @Column(name = "english_sentence", columnDefinition = "TEXT")
    private String english;

    @ManyToOne
    @JoinColumn(name = "news_id")
    private News news;

    @Builder
    public Sentence(String korean, String english, News news) {
        this.korean = korean;
        this.english = english;
        this.news = news;
    }
}
