package com.cloud.CloudNest.entities;

import jakarta.persistence.GeneratedValue;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_share_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileShareLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private FileMetadata file;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private boolean active = true;

    private Long downloadCount = 0L;

    private Long maxDownloads;
}
