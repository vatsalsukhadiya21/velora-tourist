package com.velora.api.service;

import com.velora.api.dto.response.ApiResponse;
import com.velora.api.exception.ResourceNotFoundException;
import com.velora.api.model.Like;
import com.velora.api.model.Post;
import com.velora.api.model.User;
import com.velora.api.repository.LikeRepository;
import com.velora.api.repository.PostRepository;
import com.velora.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for toggling likes on posts, maintaining denormalized like counts.
 */
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Toggles the like status for a post. If the user has already liked the post,
     * the like is removed; otherwise a new like is created.
     *
     * @param postId the post ID
     * @param userId the authenticated user's ID
     * @return an {@link ApiResponse} indicating whether the post was liked or unliked
     */
    @Transactional
    public ApiResponse toggleLike(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.save(post);
            return ApiResponse.builder().success(true).message("Post unliked").build();
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            Like like = Like.builder()
                    .post(post)
                    .user(user)
                    .build();

            likeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
            return ApiResponse.builder().success(true).message("Post liked").build();
        }
    }

    /**
     * Checks whether a user has liked a specific post.
     *
     * @param postId the post ID
     * @param userId the user's ID
     * @return true if the user has liked the post
     */
    public boolean isLiked(UUID postId, UUID userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }
}
