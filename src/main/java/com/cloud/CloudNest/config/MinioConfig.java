package com.cloud.CloudNest.config;

import io.minio.BucketExistsArgs;
import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MinioConfig {
    @Value("${minio.url}")
    private String url;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket}")
    private String bucketName;

    @Bean
    public MinioClient minioClient() {

        return MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Bean
    public CommandLineRunner verifyMinioConnection(MinioClient minioClient) {
        return args -> {
            log.info("Verifying MinIO/Backblaze connection to endpoint: {}", url);
            try {
                boolean exists = minioClient.bucketExists(
                        BucketExistsArgs.builder()
                                .bucket(bucketName)
                                .build()
                );

                if (exists) {
                    log.info("✅ Connection successful! Target bucket '{}' exists and is accessible.", bucketName);
                } else {
                    log.warn("⚠️ Connected to Backblaze, but bucket '{}' was not found.", bucketName);
                }
            } catch (Exception e) {
                log.error("❌ Failed to connect to Backblaze B2: {}", e.getMessage(), e);
            }
        };
    }
}
