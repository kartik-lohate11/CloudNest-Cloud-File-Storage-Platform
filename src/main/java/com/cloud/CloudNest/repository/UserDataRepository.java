package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Long> {
    UserData findByUserNameAndPassword(String userName, String password);

    UserData findByMailAndPassword(String mail, String password);

    UserData findByUserName(String userName);

    UserData findByMail(String mail);

    boolean existsByMail(String mail);

    Optional<UserData> findByProvideTypeAndProvideId(String provideType, String provideId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE UserData u
            SET u.password = :password
            WHERE u.mail = :mail
            """)
    int updateUserPassword(
            @Param("password") String password,
            @Param("mail") String mail
    );
}
