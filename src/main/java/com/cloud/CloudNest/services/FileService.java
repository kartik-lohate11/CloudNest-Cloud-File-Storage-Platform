package com.cloud.CloudNest.services;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.entities.UserData;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
    FileMetaDataDto uploadFiles(MultipartFile file, UserData userData);
    FileMetaDataDto getFileMetadata(String fileName);
    void deleteFile(String fileName);
}
