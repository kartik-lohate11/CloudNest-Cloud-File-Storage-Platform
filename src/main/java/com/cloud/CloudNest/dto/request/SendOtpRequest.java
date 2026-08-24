package com.cloud.CloudNest.dto.request;

import com.cloud.CloudNest.enums.OtpType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {

    private String email;
    private OtpType otpType;

}
