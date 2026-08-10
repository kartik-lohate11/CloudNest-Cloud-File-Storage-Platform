package com.cloud.CloudNest.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {
    public String uploadObject(MultipartFile file);
    public InputStream download(String objectName);
}
