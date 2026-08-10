package com.cloud.CloudNest.repository;

import com.cloud.CloudNest.entities.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDataRepository extends JpaRepository<UserData,Long> {
    UserData findByUserNameAndPassword(String userName,String password);
    UserData findByUserName(String userName);
}
