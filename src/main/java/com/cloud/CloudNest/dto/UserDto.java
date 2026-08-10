package com.cloud.CloudNest.dto;

import com.cloud.CloudNest.entities.UserData;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.java.Log;

import java.util.ArrayList;
import java.util.List;

@Data

@NoArgsConstructor
public class UserDto {
    private Long id;
    private String userName;
    private String password;
    private String mail;
    private List<FileMetaDataDto> files = new ArrayList<>();


    public static UserDto toDto(UserData entity) {

        List<FileMetaDataDto> fileDtos = entity.getFiles()
                .stream()
                .map(FileMetaDataDto::toDto)
                .toList();

        UserDto userDto = new UserDto();
        userDto.setId(entity.getId());
        userDto.setUserName(entity.getUserName());
        userDto.setMail(entity.getMail());
        userDto.setPassword(entity.getPassword());
        userDto.setFiles(fileDtos);
        return userDto;
    }


    public UserData toEntity() {
        UserData entity = new UserData();
        entity.setUserName(this.userName);
        entity.setPassword(this.password);
        entity.setMail(this.mail);
        entity.setId(this.id);
        return entity;
    }
}
