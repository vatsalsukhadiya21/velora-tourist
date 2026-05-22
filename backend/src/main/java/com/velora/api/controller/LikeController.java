package com.velora.api.controller;

import com.velora.api.dto.response.ApiResponse;
import com.velora.api.model.User;
import com.velora.api.repository.UserRepository;
import com.velora.api.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for liking and un-liking posts.
 */
@RestController
@RequestMapping("/api/posts/{postId}/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final UserRepository userRepository;

    /**
     * Toggles the like status for the authenticated user on a post.
     */
    @PostMapping
    public ResponseEntity<ApiResponse> toggleLike(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        ApiResponse response = likeService.toggleLike(postId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Checks whether the authenticated user has liked a post.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> isLiked(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        boolean liked = likeService.isLiked(postId, userId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    private UUID resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getId();
    }
}
