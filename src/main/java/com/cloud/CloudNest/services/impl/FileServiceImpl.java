package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.FileNotFoundException;
import com.cloud.CloudNest.exception.FileUploadingException;
import com.cloud.CloudNest.repository.FileMetaDataRepository;
import com.cloud.CloudNest.services.FileService;
import com.cloud.CloudNest.services.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService {

    private final StorageService storageService;
    private final FileMetaDataRepository fileMetadataRepository;

    @Value("${minio.bucket}")
    private String bucketName;

    @Override
    public FileMetaDataDto uploadFiles(MultipartFile file, UserData user) {
        // Upload actual file to MinIO
        String objectName =
                storageService.uploadObject(file);

        // Create metadata
        FileMetadata metadata = new FileMetadata();

        metadata.setOriginalFileName(file.getOriginalFilename());
        metadata.setObjectName(objectName);
        metadata.setBucketName(bucketName);
        metadata.setExtension(getExtension(file.getOriginalFilename()));
        metadata.setContentType(file.getContentType());
        metadata.setSize(file.getSize());
        metadata.setUploadedBy(user);

        // Save metadata in MySQL
        return FileMetaDataDto.toDto(fileMetadataRepository.save(metadata));
    }

    @Override
    public FileMetaDataDto getFileMetadata(String fileName) {
        FileMetaDataDto fileMetaDataDto = FileMetaDataDto.toDto(fileMetadataRepository.findByOriginalFileName(fileName).get());
        if (fileMetaDataDto != null) {
            return fileMetaDataDto;
        }
        throw new FileUploadingException(fileName + " Not found");
    }

    @Override
    @Transactional
    public void deleteFile(String fileName) {
        FileMetadata metadata = fileMetadataRepository.findByObjectName(fileName);

        if (metadata != null) {
            storageService.deleteFile(metadata.getObjectName());
            fileMetadataRepository.deleteById(metadata.getId());
            log.info(fileName, " removed.");
        } else
            throw new FileNotFoundException(fileName + " Not Found");
    }

    private String getExtension(String fileName) {

        if (fileName == null || !fileName.contains(".")) {
            return "";
        }

        return fileName.substring(
                fileName.lastIndexOf(".") + 1
        );
    }
}
