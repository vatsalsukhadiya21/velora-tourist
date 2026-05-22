package com.velora.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating a comment on a post.
 */
@Data
public class CommentRequest {

    @NotBlank
    @Size(max = 1000)
    private String content;
}
