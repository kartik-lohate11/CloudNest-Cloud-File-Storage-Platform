package com.cloud.CloudNest.dto;

import com.cloud.CloudNest.entities.UserData;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class UserDto {
    private String userName;
    private String password;
    private String mail;
    @Builder.Default
    private List<FileMetaDataDto> files = new ArrayList<>();


    public static UserDto toDto(UserData entity) {

        List<FileMetaDataDto> fileDtos = entity.getFiles()
                .stream()
                .map(FileMetaDataDto::toDto)
                .toList();

        return UserDto.builder()
                .userName(entity.getUserName())
                .mail(entity.getMail())
                .files(fileDtos)
                .build();
    }


    public UserData toEntity() {
        UserData entity = new UserData();
        entity.setUserName(this.userName);
        entity.setPassword(this.password);
        entity.setMail(this.mail);
        return entity;
    }
}
