package com.velora.api.mapper;

import com.velora.api.dto.response.UserResponse;
import com.velora.api.model.User;
import org.springframework.stereotype.Component;

/**
 * Maps {@link User} entities to {@link UserResponse} DTOs.
 */
@Component
public class UserMapper {

    /**
     * Converts a User entity to a UserResponse DTO.
     *
     * @param user      the user entity
     * @param postCount the number of posts created by the user
     * @return the user response DTO
     */
    public static UserResponse toResponse(User user, long postCount) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .country(user.getCountry())
                .postCount(postCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
