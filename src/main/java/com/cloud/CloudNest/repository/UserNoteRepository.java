package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.UserNote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, Long> {

    @Query("SELECT n FROM UserNote n WHERE n.uploadedBy.userName = :identifier OR n.uploadedBy.mail = :identifier")
    Page<UserNote> findByUploadedUser(@Param("identifier") String identifier, Pageable pageable);

    @Query("SELECT n FROM UserNote n WHERE (n.uploadedBy.userName = :identifier OR n.uploadedBy.mail = :identifier) AND LOWER(n.category) = LOWER(:category)")
    Page<UserNote> findByUploadedUserAndCategory(@Param("identifier") String identifier, @Param("category") String category, Pageable pageable);
}
