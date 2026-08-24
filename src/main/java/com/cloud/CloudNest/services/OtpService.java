package com.cloud.CloudNest.services;

import com.cloud.CloudNest.dto.request.SendOtpRequest;
import com.cloud.CloudNest.dto.request.VerifyOtpRequest;
import com.cloud.CloudNest.dto.response.OtpResponse;

public interface OtpService {
    public OtpResponse sendOtp(SendOtpRequest request);
    public OtpResponse verifyOtp(VerifyOtpRequest request);
}
