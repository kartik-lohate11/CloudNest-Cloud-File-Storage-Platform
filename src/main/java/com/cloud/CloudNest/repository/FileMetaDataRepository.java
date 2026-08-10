package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetadata, Long> {
    Optional<FileMetadata> findByOriginalFileName(String originalFileName);
}
