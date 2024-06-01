package english_ai_tutor.writing_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class WritingApplication {
	public static void main(String[] args) {
		SpringApplication.run(WritingApplication.class, args);
	}
}
