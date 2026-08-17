package com.cloud.CloudNest.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {
    String uploadObject(MultipartFile file);
    InputStream download(String objectName);
    void deleteFile(String objectName);
}
