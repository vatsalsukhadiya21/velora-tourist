package com.velora.api.service;

import com.velora.api.dto.response.ApiResponse;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.exception.ResourceNotFoundException;
import com.velora.api.mapper.PostMapper;
import com.velora.api.model.Post;
import com.velora.api.model.SavedPost;
import com.velora.api.model.User;
import com.velora.api.repository.PostRepository;
import com.velora.api.repository.SavedPostRepository;
import com.velora.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for saving/unsaving (bookmarking) posts.
 */
@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Toggles the saved status of a post for the authenticated user.
     *
     * @param postId the post ID
     * @param userId the authenticated user's ID
     * @return an {@link ApiResponse} indicating whether the post was saved or unsaved
     */
    @Transactional
    public ApiResponse toggleSave(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (savedPostRepository.existsByPostIdAndUserId(postId, userId)) {
            savedPostRepository.deleteByPostIdAndUserId(postId, userId);
            return ApiResponse.builder().success(true).message("Post unsaved").build();
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            SavedPost savedPost = SavedPost.builder()
                    .post(post)
                    .user(user)
                    .build();

            savedPostRepository.save(savedPost);
            return ApiResponse.builder().success(true).message("Post saved").build();
        }
    }

    /**
     * Checks whether a user has saved a specific post.
     *
     * @param postId the post ID
     * @param userId the user's ID
     * @return true if the user has saved the post
     */
    public boolean isSaved(UUID postId, UUID userId) {
        return savedPostRepository.existsByPostIdAndUserId(postId, userId);
    }

    /**
     * Retrieves all posts saved by a user with pagination.
     *
     * @param userId   the user's ID
     * @param pageable pagination parameters
     * @return paged post responses
     */
    public PagedResponse<PostResponse> getSavedPosts(UUID userId, Pageable pageable) {
        Page<Post> page = savedPostRepository.findSavedPostsByUserId(userId, pageable);
        return PostMapper.toPagedResponse(page);
    }
}
