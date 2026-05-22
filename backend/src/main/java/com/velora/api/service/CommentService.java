package com.velora.api.service;

import com.velora.api.dto.request.CommentRequest;
import com.velora.api.dto.response.CommentResponse;
import com.velora.api.dto.response.PagedResponse;
import com.velora.api.exception.ResourceNotFoundException;
import com.velora.api.exception.UnauthorizedException;
import com.velora.api.mapper.CommentMapper;
import com.velora.api.model.Comment;
import com.velora.api.model.Post;
import com.velora.api.model.User;
import com.velora.api.repository.CommentRepository;
import com.velora.api.repository.PostRepository;
import com.velora.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for managing comments on posts, including denormalized count updates.
 */
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Retrieves comments for a post with pagination, newest first.
     *
     * @param postId   the post ID
     * @param pageable pagination parameters
     * @return paged comment responses
     */
    public PagedResponse<CommentResponse> getCommentsByPost(UUID postId, Pageable pageable) {
        Page<Comment> page = commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);

        List<CommentResponse> content = page.getContent().stream()
                .map(CommentMapper::toResponse)
                .toList();

        return PagedResponse.<CommentResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    /**
     * Adds a new comment to a post and increments the post's comment count.
     *
     * @param postId  the post to comment on
     * @param request the comment content
     * @param userId  the authenticated user's ID
     * @return the created comment response
     */
    @Transactional
    public CommentResponse addComment(UUID postId, CommentRequest request, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return CommentMapper.toResponse(comment);
    }

    /**
     * Deletes a comment and decrements the post's comment count.
     * Only the comment author may delete their comment.
     *
     * @param commentId the comment ID
     * @param userId    the authenticated user's ID
     * @throws UnauthorizedException if the user does not own the comment
     */
    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        Post post = comment.getPost();
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);

        commentRepository.delete(comment);
    }
}
