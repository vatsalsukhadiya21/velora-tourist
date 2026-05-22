package com.velora.api.repository;

import com.velora.api.model.Post;
import com.velora.api.model.SavedPost;
import com.velora.api.model.SavedPostId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link SavedPost} entity with composite key lookups
 * and a query to retrieve the actual saved posts for a user.
 */
@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, SavedPostId> {

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);

    Optional<SavedPost> findByPostIdAndUserId(UUID postId, UUID userId);

    void deleteByPostIdAndUserId(UUID postId, UUID userId);

    @Query("SELECT sp.post FROM SavedPost sp WHERE sp.user.id = :userId ORDER BY sp.createdAt DESC")
    Page<Post> findSavedPostsByUserId(@Param("userId") UUID userId, Pageable pageable);
}
