package com.cloud.CloudNest.dto.request;

public record ForgotPasswordRequest(
        String mail,
        String password
) {
}
