package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.exception.FileUploadingException;
import com.cloud.CloudNest.services.StorageService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageServiceImpl implements StorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    @Override
    public String uploadObject(MultipartFile file) {

        try {

            // Generate unique object name
            String objectName =
                    UUID.randomUUID() + "-" + file.getOriginalFilename();

            // Upload to MinIO
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(
                                    file.getInputStream(),
                                    file.getSize(),
                                    -1
                            )
                            .contentType(file.getContentType())
                            .build()
            );

            log.info(file.getOriginalFilename()+" is Uploaded..");

            return objectName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new FileUploadingException(
                    "Failed to upload file to MinIO"
            );
        }

    }

    @Override
    public InputStream download(String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new FileUploadingException("Issue to process files");
        }
    }
}
