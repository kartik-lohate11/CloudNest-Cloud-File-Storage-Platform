package com.cloud.CloudNest.controller;

import com.cloud.CloudNest.dto.FileMetaDataDto;
import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.entities.FileShareLink;
import com.cloud.CloudNest.repository.FileShareLinkRepository;
import com.cloud.CloudNest.services.FileService;
import com.cloud.CloudNest.services.NoteService;
import com.cloud.CloudNest.services.StorageService;
import com.cloud.CloudNest.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/file/api")
@RequiredArgsConstructor
public class FileUploadController {
    private final FileService fileUploadService;
    private final UserService userService;
    private final StorageService storageService;
    private final NoteService noteService;
    private final FileShareLinkRepository fileShareLinkRepository;

    private org.springframework.data.domain.Sort parseSort(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty() || "date-desc".equalsIgnoreCase(sortBy) || "newest".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("id").descending();
        }
        if ("date-asc".equalsIgnoreCase(sortBy) || "oldest".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("id").ascending();
        }
        if ("name-asc".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("originalFileName").ascending();
        }
        if ("name-desc".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("originalFileName").descending();
        }
        if ("size-desc".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("size").descending();
        }
        if ("size-asc".equalsIgnoreCase(sortBy)) {
            return org.springframework.data.domain.Sort.by("size").ascending();
        }
        return org.springframework.data.domain.Sort.by("id").descending();
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<?> getUserFiles(
            @PathVariable String userName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "sortBy", defaultValue = "date-desc") String sortBy) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, parseSort(sortBy));
        org.springframework.data.domain.Page<FileMetaDataDto> filePage = fileUploadService.searchAndFilterFiles(userName, query, fileType, pageable);
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

    @GetMapping("/search/{userName}")
    public ResponseEntity<?> searchFiles(
            @PathVariable String userName,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "date-desc") String sortBy) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, parseSort(sortBy));
        org.springframework.data.domain.Page<FileMetaDataDto> filePage = fileUploadService.searchAndFilterFiles(userName, query, null, pageable);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", filePage.getContent());
        response.put("currentPage", filePage.getNumber());
        response.put("totalElements", filePage.getTotalElements());
        response.put("totalPages", filePage.getTotalPages());
        response.put("pageSize", filePage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter/{userName}")
    public ResponseEntity<?> filterFiles(
            @PathVariable String userName,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "date-desc") String sortBy) {

        String type = (fileType != null && !fileType.isEmpty()) ? fileType : category;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, parseSort(sortBy));
        org.springframework.data.domain.Page<FileMetaDataDto> filePage = fileUploadService.searchAndFilterFiles(userName, null, type, pageable);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", filePage.getContent());
        response.put("currentPage", filePage.getNumber());
        response.put("totalElements", filePage.getTotalElements());
        response.put("totalPages", filePage.getTotalPages());
        response.put("pageSize", filePage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sort/{userName}")
    public ResponseEntity<?> sortFiles(
            @PathVariable String userName,
            @RequestParam(value = "sortBy", defaultValue = "date-desc") String sortBy,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, parseSort(sortBy));
        org.springframework.data.domain.Page<FileMetaDataDto> filePage = fileUploadService.searchAndFilterFiles(userName, null, null, pageable);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", filePage.getContent());
        response.put("currentPage", filePage.getNumber());
        response.put("totalElements", filePage.getTotalElements());
        response.put("totalPages", filePage.getTotalPages());
        response.put("pageSize", filePage.getSize());

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

        FileMetadata metadata = fileUploadService.getFileMetadata(fileName).toEntity();

        InputStream inputStream = storageService.download(metadata.getObjectName());

        // Safely encode headers for filenames containing spaces or non-ASCII characters
        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(metadata.getOriginalFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .contentLength(metadata.getSize()) // Prevents in-memory buffering & shows progress bars
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
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

    @PostMapping("/{objectName}/share")
    public ResponseEntity<?> createShareLink(
            @PathVariable String objectName) {
        return ResponseEntity.ok(fileUploadService.generateFileLink(objectName));
    }

    @GetMapping("/public/file/{token}/info")
    public ResponseEntity<?> getSharedFileMetadata(@PathVariable String token) {
        FileShareLink shareLink = fileShareLinkRepository
                .findByTokenAndActiveTrue(token)
                .orElseThrow(() -> new RuntimeException("Invalid share link"));

        return ResponseEntity.ok(FileMetaDataDto.toDto(shareLink.getFile()));
    }

    @GetMapping("/public/file/{token}")
    public ResponseEntity<?> getSharedFileInfo(
            @PathVariable String token) {
        FileShareLink shareLink =
                fileShareLinkRepository
                        .findByTokenAndActiveTrue(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid share link"));

        String filString = shareLink.getFile().getObjectName();

        FileMetadata metadata = fileUploadService.getFileMetadata(filString).toEntity();

        InputStream inputStream = storageService.download(metadata.getObjectName());

        // Safely encode headers for filenames containing spaces or non-ASCII characters
        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(metadata.getOriginalFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .contentLength(metadata.getSize()) // Prevents in-memory buffering & shows progress bars
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(new InputStreamResource(inputStream));

    }
}
