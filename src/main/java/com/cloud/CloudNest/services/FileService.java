package com.cloud.CloudNest.services;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.entities.FileShareLink;
import com.cloud.CloudNest.entities.UserData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
    FileMetaDataDto uploadFiles(MultipartFile file, UserData userData);
    FileMetaDataDto getFileMetadata(String identifier);
    List<FileMetaDataDto> getUserFiles(String userName);
    Page<FileMetaDataDto> getUserFilesPaginated(String userName, Pageable pageable);
    Page<FileMetaDataDto> searchAndFilterFiles(String userName, String query, String fileType, Pageable pageable);
    Long getUserStorageUsage(String userName);
    java.util.Map<String, Object> getUserCategoryStats(String userName);
    FileMetaDataDto renameFile(String identifier, String newName);
    void deleteFile(String identifier);
    String generateFileLink(String objectName);
}
