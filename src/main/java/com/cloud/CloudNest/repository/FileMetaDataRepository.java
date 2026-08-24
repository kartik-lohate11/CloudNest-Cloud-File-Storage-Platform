package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.FileMetadata;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetadata, Long> {
    Optional<FileMetadata> findByOriginalFileName(String originalFileName);
    FileMetadata findByObjectName(String objectName);
    @Query("SELECT f FROM FileMetadata f WHERE f.uploadedBy.userName = :identifier OR f.uploadedBy.mail = :identifier")
    java.util.List<FileMetadata> findByUploadedUser(@Param("identifier") String identifier);

    @Query("SELECT f FROM FileMetadata f WHERE f.uploadedBy.userName = :identifier OR f.uploadedBy.mail = :identifier")
    Page<FileMetadata> findByUploadedUser(@Param("identifier") String identifier, Pageable pageable);

    java.util.List<FileMetadata> findByUploadedById(Long id);

    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileMetadata f WHERE f.uploadedBy.userName = :identifier OR f.uploadedBy.mail = :identifier")
    Long sumSizeByUploadedUser(@Param("identifier") String identifier);
}
