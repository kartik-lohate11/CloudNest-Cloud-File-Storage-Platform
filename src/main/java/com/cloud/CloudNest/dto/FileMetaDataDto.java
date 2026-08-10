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
    private String contentType;
    private Long size;
    private LocalDateTime createdAt;
    private LocalDateTime uploadedAt;

    public static FileMetaDataDto toDto(FileMetadata entity) {
        return FileMetaDataDto.builder()
                .id(entity.getId())
                .originalFileName(entity.getOriginalFileName())
                .contentType(entity.getContentType())
                .size(entity.getSize())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public FileMetadata toEntity() {
        FileMetadata entity = new FileMetadata();

        entity.setId(this.id);
        entity.setOriginalFileName(this.originalFileName);
        entity.setContentType(this.contentType);
        entity.setSize(this.size);
        entity.setCreatedAt(this.createdAt);

        return entity;
    }
}
