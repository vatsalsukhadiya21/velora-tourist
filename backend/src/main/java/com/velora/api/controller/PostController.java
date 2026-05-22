package com.velora.api.controller;

import com.velora.api.dto.request.PostRequest;
import com.velora.api.dto.response.ApiResponse;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.model.User;
import com.velora.api.repository.UserRepository;
import com.velora.api.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for post CRUD, search, and trending endpoints.
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    /**
     * Retrieves a paginated list of all posts, ordered by most recent.
     */
    @GetMapping
    public ResponseEntity<PagedResponse<PostResponse>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort sortOrder = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParams[0]).ascending()
                : Sort.by(sortParams[0]).descending();

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    /**
     * Retrieves a single post by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable UUID id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    /**
     * Creates a new post with images. Requires authentication.
     */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestPart("post") @Valid PostRequest request,
            @RequestPart("images") List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        PostResponse response = postService.createPost(request, images, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing post. Only the owner may update.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        return ResponseEntity.ok(postService.updatePost(id, request, userId));
    }

    /**
     * Deletes a post. Only the owner may delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePost(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = resolveUserId(userDetails);
        postService.deletePost(id, userId);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Post deleted successfully").build());
    }

    /**
     * Retrieves trending posts from the last 30 days.
     */
    @GetMapping("/trending")
    public ResponseEntity<PagedResponse<PostResponse>> getTrending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getTrendingPosts(pageable));
    }

    /**
     * Retrieves all posts by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<PagedResponse<PostResponse>> getPostsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(postService.getPostsByUser(userId, pageable));
    }

    /**
     * Searches posts by query text, country, or category.
     */
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<PostResponse>> searchPosts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(postService.searchPosts(q, country, categoryId, pageable));
    }

    /**
     * Resolves the authenticated user's UUID from the Spring Security principal.
     */
    private UUID resolveUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getId();
    }
}
