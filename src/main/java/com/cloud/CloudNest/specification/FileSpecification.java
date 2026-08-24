package com.cloud.CloudNest.specification;

import com.cloud.CloudNest.entities.FileMetadata;
import com.cloud.CloudNest.entities.UserData;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class FileSpecification {

    public static Specification<FileMetadata> getSearchAndFilterSpecification(
            String identifier, String query, String fileType) {

        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by uploaded user (userName or mail)
            if (identifier != null && !identifier.trim().isEmpty()) {
                Join<FileMetadata, UserData> userJoin = root.join("uploadedBy");
                Predicate userPredicate = criteriaBuilder.or(
                        criteriaBuilder.equal(userJoin.get("userName"), identifier.trim()),
                        criteriaBuilder.equal(userJoin.get("mail"), identifier.trim())
                );
                predicates.add(userPredicate);
            }

            // 2. Search query filter (matches originalFileName or extension case-insensitive)
            if (query != null && !query.trim().isEmpty()) {
                String searchPattern = "%" + query.trim().toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("originalFileName")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("extension")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            // 3. File type filter (image, video, pdf, document, other)
            if (fileType != null && !fileType.trim().isEmpty() && !"all".equalsIgnoreCase(fileType.trim())) {
                String type = fileType.trim().toLowerCase();
                if ("image".equals(type) || "images".equals(type)) {
                    predicates.add(root.get("extension").in("jpg", "jpeg", "png", "webp", "gif", "svg"));
                } else if ("video".equals(type) || "videos".equals(type) || "media".equals(type)) {
                    predicates.add(root.get("extension").in("mp4", "mov", "mkv", "avi", "webm"));
                } else if ("pdf".equals(type) || "pdfs".equals(type)) {
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("extension")), "pdf"));
                } else if ("document".equals(type) || "documents".equals(type) || "docs".equals(type)) {
                    predicates.add(root.get("extension").in("doc", "docx", "txt", "xlsx", "xls", "csv", "ppt", "pptx"));
                } else if ("other".equals(type) || "others".equals(type)) {
                    predicates.add(criteriaBuilder.not(root.get("extension").in(
                            "jpg", "jpeg", "png", "webp", "gif", "svg",
                            "mp4", "mov", "mkv", "avi", "webm",
                            "pdf", "doc", "docx", "txt", "xlsx", "xls", "csv", "ppt", "pptx"
                    )));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
