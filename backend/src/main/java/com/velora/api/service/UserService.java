package com.velora.api.service;

import com.velora.api.dto.request.UpdateProfileRequest;
import com.velora.api.dto.response.UserResponse;
import com.velora.api.exception.ResourceNotFoundException;
import com.velora.api.mapper.UserMapper;
import com.velora.api.model.User;
import com.velora.api.repository.PostRepository;
import com.velora.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * Service for retrieving and updating user profiles.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ImageService imageService;

    /**
     * Retrieves a public user profile by ID.
     *
     * @param id the user ID
     * @return the user response DTO
     * @throws ResourceNotFoundException if the user does not exist
     */
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        long postCount = postRepository.findByUserId(id, org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        return UserMapper.toResponse(user, postCount);
    }

    /**
     * Retrieves the currently authenticated user's profile.
     *
     * @param userId the authenticated user's ID
     * @return the user response DTO
     */
    public UserResponse getCurrentUser(UUID userId) {
        return getUserById(userId);
    }

    /**
     * Updates the authenticated user's profile fields and optional avatar image.
     *
     * @param userId  the authenticated user's ID
     * @param request the profile update data (all fields optional)
     * @param avatar  an optional new avatar image
     * @return the updated user response DTO
     */
    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request, MultipartFile avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }

        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = imageService.uploadImage(avatar);
            user.setAvatarUrl(avatarUrl);
        }

        user = userRepository.save(user);
        long postCount = postRepository.findByUserId(userId, org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        return UserMapper.toResponse(user, postCount);
    }
}
