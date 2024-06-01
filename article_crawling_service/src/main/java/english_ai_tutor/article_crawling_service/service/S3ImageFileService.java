package english_ai_tutor.article_crawling_service.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import english_ai_tutor.article_crawling_service.exception.S3UploadException;
import english_ai_tutor.article_crawling_service.repository.NewsRepository;
import english_ai_tutor.article_crawling_service.repository.SentenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ImageFileService {
    private final AmazonS3Client amazonS3Client;
    private final NewsRepository newsRepository;
    private final SentenceRepository sentenceRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.domain}")
    private String domain;

    public String uploadFile(byte[] imageData){
        //imageData 가 null 일시 메소드 종료
        if(imageData == null) return null;

        // 이미지 이름 생성
        String imageName = UUID.randomUUID().toString() + ".jpg";
        // s3 이미지 url
        String imageFileUrl = domain + "/" + imageName;

        try(InputStream inputStream = new ByteArrayInputStream(imageData)){
            // s3에 저장할 오브젝트의 메타 데이터 생성
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType("image/jpeg");
            objectMetadata.setContentLength(imageData.length);

            // s3에 저장
            amazonS3Client.putObject(new PutObjectRequest("capstone-writing-service-bucket", imageName, inputStream, objectMetadata));
        }catch(IOException ioException){
            throw new S3UploadException("S3에 이미지 파일 하는 도중 예외 발생");
        }
        // s3 이미지 url을 반환
        return imageFileUrl;
    }

    public void deleteFile(String fileUrl){
        String fileName = StringUtils.getFilename(fileUrl);
        amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }

}
