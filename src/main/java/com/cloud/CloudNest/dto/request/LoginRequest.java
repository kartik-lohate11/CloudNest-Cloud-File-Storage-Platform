package com.cloud.CloudNest.dto.request;

public record LoginRequest(
        String userName,
        String password
) {
}
