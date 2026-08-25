package com.cloud.CloudNest.dto.response;

import com.cloud.CloudNest.dto.UserDto;

public record AuthResponse(
        String token,
        UserDto userDto
) {
}
