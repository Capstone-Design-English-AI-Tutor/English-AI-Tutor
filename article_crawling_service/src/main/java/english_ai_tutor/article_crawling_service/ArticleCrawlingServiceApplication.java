package english_ai_tutor.article_crawling_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ArticleCrawlingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArticleCrawlingServiceApplication.class, args);
	}

}
