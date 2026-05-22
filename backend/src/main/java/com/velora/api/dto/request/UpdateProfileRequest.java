package com.velora.api.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for updating a user's profile. All fields are optional.
 */
@Data
public class UpdateProfileRequest {

    @Size(min = 3, max = 50)
    private String username;

    @Size(max = 100)
    private String displayName;

    @Size(max = 500)
    private String bio;

    private String country;
}
