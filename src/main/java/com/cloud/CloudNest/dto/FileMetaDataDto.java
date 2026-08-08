package com.cloud.CloudNest.dto;

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
}
