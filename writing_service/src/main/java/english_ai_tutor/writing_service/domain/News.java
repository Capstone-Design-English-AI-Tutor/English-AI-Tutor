package english_ai_tutor.writing_service.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class News {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String s3Url;
    private Integer level;
    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "news", cascade = CascadeType.REMOVE)
    private List<Sentence> sentences = new ArrayList<>();

    @Builder
    public News(String title, String s3Url, Integer level, String category, LocalDateTime localDateTime) {
        this.title = title;
        this.s3Url = s3Url;
        this.level = level;
        this.category = category;
        this.createdAt = localDateTime;
    }
}
