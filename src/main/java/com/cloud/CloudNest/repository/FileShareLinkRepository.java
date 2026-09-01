package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.FileShareLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileShareLinkRepository extends JpaRepository<FileShareLink,Long> {
    Optional<FileShareLink> findByTokenAndActiveTrue(String token);
}
