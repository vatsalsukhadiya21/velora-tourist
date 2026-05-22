package com.velora.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for a post, including author summary, image URLs, and engagement counts.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {

    private UUID id;
    private String title;
    private String description;
    private String country;
    private String city;
    private String categoryName;
    private String categorySlug;
    private String tags;
    private List<String> imageUrls;
    private long likeCount;
    private long commentCount;
    private UserSummary author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Lightweight user summary embedded in post and comment responses.
     */
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserSummary {
        private UUID id;
        private String username;
        private String displayName;
        private String avatarUrl;
    }
}
