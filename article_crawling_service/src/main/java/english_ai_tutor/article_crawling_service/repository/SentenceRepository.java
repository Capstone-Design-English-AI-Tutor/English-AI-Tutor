package english_ai_tutor.article_crawling_service.repository;

import english_ai_tutor.article_crawling_service.domain.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Long> {
}
