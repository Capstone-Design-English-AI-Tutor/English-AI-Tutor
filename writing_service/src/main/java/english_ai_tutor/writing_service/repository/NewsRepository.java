package english_ai_tutor.writing_service.repository;

import english_ai_tutor.writing_service.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    public List<News> findALLByLevel(int level);
}
