package com.cloud.CloudNest.dto;

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
    private List<FileMetaDataDto> files = new ArrayList<>();
}
