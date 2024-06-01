package english_ai_tutor.article_crawling_service.scheduler;

import english_ai_tutor.article_crawling_service.service.CrawlingService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CrawlingScheduler {
    private final CrawlingService crawlingService;

    @Scheduled(fixedDelay = 1000 * 60 * 60 * 24)
    public void crawling(){
        crawlingService.crawling();
    }

}
