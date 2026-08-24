package com.cloud.CloudNest.controller;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.services.NoteService;
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
    private final NoteService noteService;

    @GetMapping("/user/{userName}")
    public ResponseEntity<?> getUserFiles(
            @PathVariable String userName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        org.springframework.data.domain.Page<FileMetaDataDto> filePage = fileUploadService.getUserFilesPaginated(userName, pageable);
        Long totalStorageBytes = fileUploadService.getUserStorageUsage(userName);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", filePage.getContent());
        response.put("currentPage", filePage.getNumber());
        response.put("totalElements", filePage.getTotalElements());
        response.put("totalPages", filePage.getTotalPages());
        response.put("pageSize", filePage.getSize());
        response.put("totalStorageUsedBytes", totalStorageBytes);
        response.put("categoryStats", fileUploadService.getUserCategoryStats(userName));

        return ResponseEntity.ok(response);
    }

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

    @PutMapping("/rename/{fileName}")
    public ResponseEntity<?> renameFile(
            @PathVariable String fileName,
            @RequestParam("newName") String newName) {

        FileMetaDataDto metadata = fileUploadService.renameFile(fileName, newName);
        return ResponseEntity.ok(metadata);
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<?> deleteFile(
            @PathVariable String fileName) {

        fileUploadService.deleteFile(fileName);

        return ResponseEntity.ok(
                "File deleted successfully"
        );
    }

    @GetMapping("/notes/user/{userName}")
    public ResponseEntity<?> getUserNotes(
            @PathVariable String userName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "category", required = false) String category) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        org.springframework.data.domain.Page<com.cloud.CloudNest.dto.NoteDto> notePage = noteService.getUserNotesPaginated(userName, category, pageable);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", notePage.getContent());
        response.put("currentPage", notePage.getNumber());
        response.put("totalElements", notePage.getTotalElements());
        response.put("totalPages", notePage.getTotalPages());
        response.put("pageSize", notePage.getSize());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/notes")
    public ResponseEntity<?> createNote(
            @RequestBody com.cloud.CloudNest.dto.NoteDto noteDto,
            @RequestHeader("userName") String userName) {
        com.cloud.CloudNest.dto.NoteDto created = noteService.saveNote(noteDto, userName);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long id,
            @RequestBody com.cloud.CloudNest.dto.NoteDto noteDto,
            @RequestHeader(value = "userName", required = false) String userName) {
        com.cloud.CloudNest.dto.NoteDto updated = noteService.updateNote(id, noteDto, userName);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok("Note deleted successfully");
    }
}
