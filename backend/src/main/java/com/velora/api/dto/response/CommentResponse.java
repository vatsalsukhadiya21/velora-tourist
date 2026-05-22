package com.velora.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a comment, including the author summary.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {

    private UUID id;
    private String content;
    private PostResponse.UserSummary author;
    private LocalDateTime createdAt;
}
