package english_ai_tutor.writing_service.repository;

import english_ai_tutor.writing_service.domain.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Long> {
    public List<Sentence> findAllByNewsId(Long newsId);
}
