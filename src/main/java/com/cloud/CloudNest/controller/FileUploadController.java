package com.cloud.CloudNest.controller;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.services.FileService;
import com.cloud.CloudNest.services.StorageService;
import com.cloud.CloudNest.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequestMapping("/file/api")
@RequiredArgsConstructor
public class FileUploadController {
    private final FileService fileUploadService;
    private final UserService userService;
    private final StorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file, @RequestHeader("userName") String userName) {

        UserDto userDto = userService.getByUserName(userName);

        FileMetaDataDto metadata =
                fileUploadService.uploadFiles(file, userDto.toEntity());

        return ResponseEntity.ok(metadata);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable String fileName) {

        FileMetadata metadata =
                fileUploadService.getFileMetadata(fileName).toEntity();

        InputStream inputStream =
                storageService.download(
                        metadata.getObjectName());

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                metadata.getContentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                metadata.getOriginalFileName() + "\"")
                .body(new InputStreamResource(inputStream));
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<?> deleteFile(
            @PathVariable String fileName) {

        fileUploadService.deleteFile(fileName);

        return ResponseEntity.ok(
                "File deleted successfully"
        );
    }
}
