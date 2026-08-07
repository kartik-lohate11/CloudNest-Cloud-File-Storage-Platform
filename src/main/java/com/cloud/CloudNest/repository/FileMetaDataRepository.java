package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetadata, Long> {
}
