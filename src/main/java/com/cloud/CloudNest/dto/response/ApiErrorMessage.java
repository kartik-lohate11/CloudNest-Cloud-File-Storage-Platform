package com.cloud.CloudNest.dto.response;

public record ApiErrorMessage(
        String message,
        String status
) {
}
