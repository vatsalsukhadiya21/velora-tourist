package com.velora.api.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a post category (e.g., "Adventure", "Beach", "Culture").
 */
@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(unique = true, nullable = false, length = 50)
    private String slug;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;
}
