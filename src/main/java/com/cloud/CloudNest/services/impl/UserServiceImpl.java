package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.request.LoginRequest;
import com.cloud.CloudNest.dto.request.UpdateProfileRequest;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.UserNotFoundException;
import com.cloud.CloudNest.repository.UserDataRepository;
import com.cloud.CloudNest.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDataRepository userDataRepository;

    @Override
    public UserDto registerUser(UserDto user) {
        return UserDto.toDto(userDataRepository.save(user.toEntity()));
    }

    @Override
    public UserDto loginUser(LoginRequest request) {
        UserData userData = userDataRepository.findByUserNameAndPassword(request.userName(), request.password());
        if (userData != null) return UserDto.toDto(userData);

        else throw new UserNotFoundException(request.userName() + " User Not Found");
    }

    @Override
    public UserDto getUserById(Long id) {
        return null;
    }

    @Override
    public UserDto getUserByEmail(String mail) {
        return null;
    }

    @Override
    public UserDto updateProfile(UpdateProfileRequest request) {
        return null;
    }

    @Override
    public UserDto getByUserName(String userName) {
        UserData userData = userDataRepository.findByUserName(userName);
        if (userData != null) return UserDto.toDto(userData);
        throw new UserNotFoundException(userName + " Not Found");
    }
}
