package com.velora.api.controller;

import com.velora.api.dto.request.CommentRequest;
import com.velora.api.dto.response.ApiResponse;
import com.velora.api.dto.response.CommentResponse;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.model.User;
import com.velora.api.repository.UserRepository;
import com.velora.api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for comment operations on posts.
 */
@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    /**
     * Retrieves paginated comments for a post.
     */
    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<PagedResponse<CommentResponse>> getComments(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(commentService.getCommentsByPost(postId, pageable));
    }

    /**
     * Adds a new comment to a post. Requires authentication.
     */
    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        CommentResponse response = commentService.addComment(postId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Deletes a comment. Only the comment author may delete.
     */
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(
            @PathVariable UUID commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Comment deleted successfully").build());
    }

    private UUID resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getId();
    }
}
