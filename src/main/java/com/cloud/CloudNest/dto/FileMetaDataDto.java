package com.cloud.CloudNest.dto;

import com.cloud.CloudNest.entities.FileMetadata;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FileMetaDataDto {

    private Long id;

    private String originalFileName;

    private String objectName;

    private String bucketName;

    private String extension;

    private String contentType;

    private Long size;

    private Long uploadedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public static FileMetaDataDto toDto(FileMetadata entity) {

        return FileMetaDataDto.builder()
                .id(entity.getId())
                .originalFileName(entity.getOriginalFileName())
                .objectName(entity.getObjectName())
                .bucketName(entity.getBucketName())
                .extension(entity.getExtension())
                .contentType(entity.getContentType())
                .size(entity.getSize())
                .uploadedBy(
                        entity.getUploadedBy() != null
                                ? entity.getUploadedBy().getId()
                                : null
                )
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }


    public FileMetadata toEntity() {

        FileMetadata entity = new FileMetadata();

        entity.setId(this.id);
        entity.setOriginalFileName(this.originalFileName);
        entity.setObjectName(this.objectName);
        entity.setBucketName(this.bucketName);
        entity.setExtension(this.extension);
        entity.setContentType(this.contentType);
        entity.setSize(this.size);
        entity.setCreatedAt(this.createdAt);
        entity.setUpdatedAt(this.updatedAt);

        return entity;
    }
}