package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.FileNotFoundException;
import com.cloud.CloudNest.exception.FileUploadingException;
import com.cloud.CloudNest.exception.StorageLimitExceededException;
import com.cloud.CloudNest.repository.FileMetaDataRepository;
import com.cloud.CloudNest.services.FileService;
import com.cloud.CloudNest.services.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService {

    private final StorageService storageService;
    private final FileMetaDataRepository fileMetadataRepository;

    @Value("${minio.bucket}")
    private String bucketName;

    private static final long MAX_STORAGE_LIMIT_BYTES = 5L * 1024 * 1024 * 1024; // 5 GB
    private static final long MAX_SINGLE_FILE_LIMIT_BYTES = 100L * 1024 * 1024; // 100 MB

    @Override
    public FileMetaDataDto uploadFiles(MultipartFile file, UserData user) {
        long currentUsedBytes = getUserStorageUsage(user.getUserName());
        long newFileSize = file.getSize();

        if (newFileSize > MAX_SINGLE_FILE_LIMIT_BYTES) {
            double fileMB = (double) newFileSize / (1024 * 1024);
            throw new StorageLimitExceededException(
                    String.format("File size exceeds maximum allowed limit of 100 MB per file (File size: %.2f MB).", fileMB)
            );
        }

        if (currentUsedBytes + newFileSize > MAX_STORAGE_LIMIT_BYTES) {
            double usedGB = (double) currentUsedBytes / (1024 * 1024 * 1024);
            double fileMB = (double) newFileSize / (1024 * 1024);
            throw new StorageLimitExceededException(
                    String.format("Storage limit exceeded! You have used %.2f GB of your 5 GB quota. This file (%.2f MB) exceeds your remaining space.", usedGB, fileMB)
            );
        }

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
    public FileMetaDataDto getFileMetadata(String identifier) {
        FileMetadata metadata = fileMetadataRepository.findByObjectName(identifier);
        if (metadata == null) {
            metadata = fileMetadataRepository.findByOriginalFileName(identifier).orElse(null);
        }
        if (metadata != null) {
            return FileMetaDataDto.toDto(metadata);
        }
        throw new FileNotFoundException(identifier + " Not found");
    }

    @Override
    public List<FileMetaDataDto> getUserFiles(String userName) {
        List<FileMetadata> files = fileMetadataRepository.findByUploadedUser(userName);
        return files.stream()
                .map(FileMetaDataDto::toDto)
                .toList();
    }

    @Override
    public Page<FileMetaDataDto> getUserFilesPaginated(String userName, Pageable pageable) {
        Page<FileMetadata> page = fileMetadataRepository.findByUploadedUser(userName, pageable);
        return page.map(FileMetaDataDto::toDto);
    }

    @Override
    public Long getUserStorageUsage(String userName) {
        Long sum = fileMetadataRepository.sumSizeByUploadedUser(userName);
        return sum != null ? sum : 0L;
    }

    @Override
    public java.util.Map<String, Object> getUserCategoryStats(String userName) {
        List<FileMetadata> files = fileMetadataRepository.findByUploadedUser(userName);

        long imageCount = 0, imageBytes = 0;
        long videoCount = 0, videoBytes = 0;
        long docCount = 0, docBytes = 0;
        long otherCount = 0, otherBytes = 0;

        for (FileMetadata f : files) {
            String ext = f.getExtension() != null ? f.getExtension().toLowerCase() : "";
            long size = f.getSize() != null ? f.getSize() : 0L;

            if (java.util.Arrays.asList("jpg", "jpeg", "png", "webp", "gif", "svg").contains(ext)) {
                imageCount++;
                imageBytes += size;
            } else if (java.util.Arrays.asList("mp4", "mov", "mkv", "avi", "webm").contains(ext)) {
                videoCount++;
                videoBytes += size;
            } else if (java.util.Arrays.asList("pdf", "doc", "docx", "txt", "xlsx", "xls", "csv", "ppt", "pptx").contains(ext)) {
                docCount++;
                docBytes += size;
            } else {
                otherCount++;
                otherBytes += size;
            }
        }

        java.util.Map<String, Object> stats = new java.util.HashMap<>();

        java.util.Map<String, Object> imgMap = new java.util.HashMap<>();
        imgMap.put("count", imageCount);
        imgMap.put("bytes", imageBytes);
        stats.put("image", imgMap);

        java.util.Map<String, Object> vidMap = new java.util.HashMap<>();
        vidMap.put("count", videoCount);
        vidMap.put("bytes", videoBytes);
        stats.put("video", vidMap);

        java.util.Map<String, Object> docMap = new java.util.HashMap<>();
        docMap.put("count", docCount);
        docMap.put("bytes", docBytes);
        stats.put("document", docMap);

        java.util.Map<String, Object> othMap = new java.util.HashMap<>();
        othMap.put("count", otherCount);
        othMap.put("bytes", otherBytes);
        stats.put("other", othMap);

        return stats;
    }

    @Override
    @Transactional
    public FileMetaDataDto renameFile(String identifier, String newName) {
        FileMetadata metadata = fileMetadataRepository.findByObjectName(identifier);
        if (metadata == null) {
            metadata = fileMetadataRepository.findByOriginalFileName(identifier).orElse(null);
        }
        if (metadata != null) {
            metadata.setOriginalFileName(newName);
            return FileMetaDataDto.toDto(fileMetadataRepository.save(metadata));
        }
        throw new FileNotFoundException(identifier + " Not found for rename");
    }

    @Override
    @Transactional
    public void deleteFile(String identifier) {
        FileMetadata metadata = fileMetadataRepository.findByObjectName(identifier);
        if (metadata == null) {
            metadata = fileMetadataRepository.findByOriginalFileName(identifier).orElse(null);
        }

        if (metadata != null) {
            storageService.deleteFile(metadata.getObjectName());
            fileMetadataRepository.deleteById(metadata.getId());
            log.info(identifier + " removed.");
        } else
            throw new FileNotFoundException(identifier + " Not Found");
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
