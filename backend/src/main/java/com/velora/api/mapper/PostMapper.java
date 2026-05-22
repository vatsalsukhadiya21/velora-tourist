package com.velora.api.mapper;

import com.velora.api.dto.response.PagedResponse;
import com.velora.api.dto.response.PostResponse;
import com.velora.api.model.Category;
import com.velora.api.model.Post;
import com.velora.api.model.PostImage;
import com.velora.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Maps {@link Post} entities to {@link PostResponse} DTOs.
 */
@Component
public class PostMapper {

    /**
     * Converts a Post entity to a PostResponse DTO.
     *
     * @param post the post entity
     * @return the fully populated post response
     */
    public static PostResponse toResponse(Post post) {
        User user = post.getUser();
        Category category = post.getCategory();

        List<String> imageUrls = post.getImages() != null
                ? post.getImages().stream()
                    .map(PostImage::getImageUrl)
                    .toList()
                : Collections.emptyList();

        PostResponse.UserSummary author = PostResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .country(post.getCountry())
                .city(post.getCity())
                .categoryName(category != null ? category.getName() : null)
                .categorySlug(category != null ? category.getSlug() : null)
                .tags(post.getTags())
                .imageUrls(imageUrls)
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .author(author)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    /**
     * Converts a Spring Data Page of Posts to a PagedResponse of PostResponses.
     *
     * @param page the page of post entities
     * @return the paged response DTO
     */
    public static PagedResponse<PostResponse> toPagedResponse(Page<Post> page) {
        List<PostResponse> content = page.getContent().stream()
                .map(PostMapper::toResponse)
                .toList();

        return PagedResponse.<PostResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
