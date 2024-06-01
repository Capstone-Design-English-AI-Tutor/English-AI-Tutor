package english_ai_tutor.article_crawling_service.repository;

import english_ai_tutor.article_crawling_service.domain.News;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    @Query("SELECT n FROM News n join fetch n.sentences where n.level = :level")
    public List<News> findByLevel(Integer level, Pageable pageable);
}
