package com.velora.api.service;

import com.velora.api.dto.request.PostRequest;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.exception.ResourceNotFoundException;
import com.velora.api.exception.UnauthorizedException;
import com.velora.api.mapper.PostMapper;
import com.velora.api.model.Category;
import com.velora.api.model.Post;
import com.velora.api.model.PostImage;
import com.velora.api.model.User;
import com.velora.api.repository.CategoryRepository;
import com.velora.api.repository.PostRepository;
import com.velora.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for creating, reading, updating, and deleting travel posts.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;

    /**
     * Retrieves all posts with pagination, ordered by most recent first.
     *
     * @param pageable pagination parameters
     * @return paged post responses
     */
    public PagedResponse<PostResponse> getAllPosts(Pageable pageable) {
        Page<Post> page = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PostMapper.toPagedResponse(page);
    }

    /**
     * Retrieves a single post by its ID.
     *
     * @param id the post ID
     * @return the post response
     * @throws ResourceNotFoundException if the post does not exist
     */
    public PostResponse getPostById(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return PostMapper.toResponse(post);
    }

    /**
     * Creates a new post with uploaded images.
     *
     * @param request the post creation data
     * @param images  the image files to attach
     * @param userId  the ID of the authenticated user
     * @return the created post response
     */
    @Transactional
    public PostResponse createPost(PostRequest request, List<MultipartFile> images, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        Post post = Post.builder()
                .user(user)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .country(request.getCountry())
                .city(request.getCity())
                .tags(request.getTags())
                .build();

        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                String imageUrl = imageService.uploadImage(images.get(i));
                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl(imageUrl)
                        .displayOrder(i)
                        .build();
                post.getImages().add(postImage);
            }
        }

        post = postRepository.save(post);
        return PostMapper.toResponse(post);
    }

    /**
     * Updates an existing post. Only the post owner may perform this action.
     *
     * @param postId  the ID of the post to update
     * @param request the updated post data
     * @param userId  the ID of the authenticated user
     * @return the updated post response
     * @throws UnauthorizedException if the user does not own the post
     */
    @Transactional
    public PostResponse updatePost(UUID postId, PostRequest request, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setCountry(request.getCountry());
        post.setCity(request.getCity());
        post.setTags(request.getTags());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            post.setCategory(category);
        }

        post = postRepository.save(post);
        return PostMapper.toResponse(post);
    }

    /**
     * Deletes a post. Only the post owner may perform this action.
     *
     * @param postId the ID of the post to delete
     * @param userId the ID of the authenticated user
     * @throws UnauthorizedException if the user does not own the post
     */
    @Transactional
    public void deletePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    /**
     * Retrieves all posts by a specific user with pagination.
     *
     * @param userId   the user's ID
     * @param pageable pagination parameters
     * @return paged post responses
     */
    public PagedResponse<PostResponse> getPostsByUser(UUID userId, Pageable pageable) {
        Page<Post> page = postRepository.findByUserId(userId, pageable);
        return PostMapper.toPagedResponse(page);
    }

    /**
     * Retrieves trending posts from the last 30 days, ordered by like count.
     *
     * @param pageable pagination parameters
     * @return paged post responses
     */
    public PagedResponse<PostResponse> getTrendingPosts(Pageable pageable) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        Page<Post> page = postRepository.findTrending(since, pageable);
        return PostMapper.toPagedResponse(page);
    }

    /**
     * Searches posts by text query, country, or category. Falls back to returning all posts
     * if no filter criteria are provided.
     *
     * @param query      optional text to search in title/description
     * @param country    optional country filter
     * @param categoryId optional category filter
     * @param pageable   pagination parameters
     * @return paged post responses matching the search criteria
     */
    public PagedResponse<PostResponse> searchPosts(String query, String country, Long categoryId, Pageable pageable) {
        Page<Post> page;

        if (query != null && !query.isBlank()) {
            page = postRepository.searchByQuery(query.trim(), pageable);
        } else if (country != null && !country.isBlank()) {
            page = postRepository.findByCountryContaining(country.trim(), pageable);
        } else if (categoryId != null) {
            page = postRepository.findByCategoryId(categoryId, pageable);
        } else {
            page = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return PostMapper.toPagedResponse(page);
    }
}
