package com.velora.api.mapper;

import com.velora.api.dto.response.CommentResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.model.Comment;
import com.velora.api.model.User;
import org.springframework.stereotype.Component;

/**
 * Maps {@link Comment} entities to {@link CommentResponse} DTOs.
 */
@Component
public class CommentMapper {

    /**
     * Converts a Comment entity to a CommentResponse DTO.
     *
     * @param comment the comment entity
     * @return the comment response DTO
     */
    public static CommentResponse toResponse(Comment comment) {
        User user = comment.getUser();

        PostResponse.UserSummary author = PostResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(author)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
