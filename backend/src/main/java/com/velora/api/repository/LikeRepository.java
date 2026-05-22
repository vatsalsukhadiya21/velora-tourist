package com.velora.api.repository;

import com.velora.api.model.Like;
import com.velora.api.model.LikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link Like} entity with composite key lookups.
 */
@Repository
public interface LikeRepository extends JpaRepository<Like, LikeId> {

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);

    Optional<Like> findByPostIdAndUserId(UUID postId, UUID userId);

    void deleteByPostIdAndUserId(UUID postId, UUID userId);
}
