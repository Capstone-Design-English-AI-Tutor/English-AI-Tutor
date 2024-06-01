package english_ai_tutor.article_crawling_service.service;

import english_ai_tutor.article_crawling_service.domain.News;
import english_ai_tutor.article_crawling_service.domain.Sentence;
import english_ai_tutor.article_crawling_service.dto.DeepLDto;
import english_ai_tutor.article_crawling_service.event.upload.UploadRollbackEvent;
import english_ai_tutor.article_crawling_service.exception.ImageReadException;
import english_ai_tutor.article_crawling_service.repository.NewsRepository;
import english_ai_tutor.article_crawling_service.repository.SentenceRepository;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CrawlingService {
    private final S3ImageFileService s3ImageFileService;
    private final TranslationService translationService;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final NewsRepository newsRepository;
    private final SentenceRepository sentenceRepository;
    private static final String CRAWLING_URL = "https://engoo.co.kr/app/daily-news/search";

    @Transactional
    public void crawling(){
        for (int level = 5; level <= 10; level++){

            // 오늘 업데이트된 기사 파악
//            int count = countUpdateNews(level);

            // 업데이트 된 기사 만큼 기사 삭제
//            removeNews(level, count);

            // 기사 크롤링
            for (int article = 1; article <= 5; article++) {
                crawlingOne(level, article);
            }
        }
    }
    private int countUpdateNews(int level){
        int count = 0;

        // 사이트 접속
        String urlByLevel = CRAWLING_URL + String.format("?max_level=%d&min_level=%d", level, level);
        WebDriver driver = new ChromeDriver();
        driver.get(urlByLevel);

        // 오늘 나온 기사 추출
        for (int i = 1 ; i <= 10; i++){
            WebElement timeElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.presenceOfElementLocated(By.xpath(String.format("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/article[%d]/a/div[2]/div/div[1]/div/time", i))));

            String datetime = timeElement.getText();

            // 추출한 문자열에 시간이 포함되면 오늘 써진 기사
            if(datetime.contains("시간")) count++;
            else break;
        }

        driver.quit();

        return count;
    }


    private void removeNews(int level, int count) {
        List<News> findNews = newsRepository.findByLevel(level, PageRequest.of(0, count, Sort.by("createAt").ascending()));
        List<String> s3Urls = findNews.stream().map(News::getS3Url).toList();
        newsRepository.deleteAll(findNews);
        s3Urls.forEach(s3ImageFileService::deleteFile);
    }

    private void crawlingOne(int level, int article){
        WebDriver driver = new ChromeDriver();

        String urlByLevel = CRAWLING_URL + String.format("?max_level=%d&min_level=%d", level, level);

        // 사이트 접속
        driver.get(urlByLevel);


        WebElement dateTimeElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath(String.format("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/article[%d]/a/div[2]/div/div[1]/div/time", article))));

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        ZonedDateTime utcDateTime = ZonedDateTime.parse(dateTimeElement.getAttribute("datetime"), formatter.withZone(ZoneId.of("UTC")));

        ZonedDateTime seoulDateTime = utcDateTime.withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        LocalDateTime localDateTime = seoulDateTime.toLocalDateTime();

        // 뉴스 기사 클릭
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.elementToBeClickable(By.xpath(String.format("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/article[%d]/a", article))))
                .click();

        // 뉴스 제목 추출
        WebElement titleElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div[2]/div[1]/div/span/span/span")));
        String newsTitle = titleElement.getText();

        // 뉴스 이미지 추출
        WebElement imageElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div[1]/div/button/div[1]/img")));
        String imageUrl = imageElement.getAttribute("src");

        byte[] imageData = readImageFileFromUrl(imageUrl);

        // s3에 저장
        String fileUrl = s3ImageFileService.uploadFile(imageData);

        // 예외 발생 시 롤백이 발생하면 s3에 저장했던 이미지 삭제
        applicationEventPublisher.publishEvent(new UploadRollbackEvent(fileUrl));

        // 뉴스 카테고리 추출
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div[2]/div")));

        List<WebElement> driverElementsForCategory = driver.findElements(By.xpath("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div[2]/div"));

        WebElement categoryElement = driver.findElement(By.xpath(String.format("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[1]/div/div/div[2]/div[2]/div[%d]/div/div[2]/div/div/a", driverElementsForCategory.size() - 1)));

        String category = categoryElement.getText();

        // 뉴스 엔티티 생성 및 저장
        News news = News.builder()
                .title(newsTitle)
                .s3Url(fileUrl)
                .level(level - 4)
                .category(category)
                .localDateTime(localDateTime)
                .build();

        newsRepository.save(news);

        // 뉴스 기사 문장 추출
        List<WebElement> pTagElements = driver.findElements(By.xpath("/html/body/div[1]/div[2]/div/section/div[2]/div[1]/main/div/div[2]/div/div/div/div/div/div[3]/div/div/div[3]/div/div/div[2]/p"));

        List<DeepLDto.Request> deepLRequest = pTagElements.stream().map(element -> DeepLDto.Request.builder().english(element.getText()).build()).toList();

        // 번역 메소드 호출
        List<DeepLDto.Response> deepLResponse = translationService.translate(deepLRequest);

        // 문장 엔티티 생성 및 저장
        List<Sentence> sentences = deepLResponse.stream().map(r ->
                Sentence.builder()
                        .korean(r.korean())
                        .english(r.english())
                        .news(news)
                        .build()).toList();

        sentenceRepository.saveAll(sentences);

        // 이전 페이지 이동
        driver.navigate().back();

        driver.quit();
    }

    private byte[] readImageFileFromUrl(String imageUrl) {
        byte[] imageData = null;

        try(InputStream inputstream = new URL(imageUrl).openStream();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream()){
            byte[] buffer = new byte[2048];
            int length;

            while((length = inputstream.read(buffer)) != -1){
                outputStream.write(buffer, 0, length);
            }
            imageData = outputStream.toByteArray();
            return imageData;
        }catch (IOException e){
            throw new ImageReadException("이미지 파일을 읽는데 문제가 생겼습니다.", e);
        }

    }

}
