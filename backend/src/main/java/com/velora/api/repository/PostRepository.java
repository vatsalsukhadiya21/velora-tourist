package com.velora.api.repository;

import com.velora.api.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Repository for {@link Post} entity with paged queries for feeds, search, and trending.
 */
@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByUserId(UUID userId, Pageable pageable);

    Page<Post> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.country ILIKE %:country%")
    Page<Post> findByCountryContaining(@Param("country") String country, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',:query,'%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%',:query,'%'))")
    Page<Post> searchByQuery(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.createdAt >= :since ORDER BY p.likeCount DESC")
    Page<Post> findTrending(@Param("since") LocalDateTime since, Pageable pageable);
}
