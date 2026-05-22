package com.velora.api.controller;

import com.velora.api.dto.response.ApiResponse;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.model.User;
import com.velora.api.repository.UserRepository;
import com.velora.api.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for saving/bookmarking posts.
 */
@RestController
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;
    private final UserRepository userRepository;

    /**
     * Toggles the saved status for the authenticated user on a post.
     */
    @PostMapping("/api/posts/{postId}/save")
    public ResponseEntity<ApiResponse> toggleSave(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        ApiResponse response = savedPostService.toggleSave(postId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Checks whether the authenticated user has saved a post.
     */
    @GetMapping("/api/posts/{postId}/save/status")
    public ResponseEntity<Map<String, Boolean>> isSaved(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        boolean saved = savedPostService.isSaved(postId, userId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    /**
     * Retrieves all posts saved by the authenticated user.
     */
    @GetMapping("/api/saved")
    public ResponseEntity<PagedResponse<PostResponse>> getSavedPosts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        UUID userId = resolveUserId(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(savedPostService.getSavedPosts(userId, pageable));
    }

    private UUID resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getId();
    }
}
