package com.velora.api.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents an image attached to a post, with an ordering index.
 */
@Entity
@Table(name = "post_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"post"})
@ToString(exclude = {"post"})
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "display_order")
    @Builder.Default
    private int displayOrder = 0;
}
