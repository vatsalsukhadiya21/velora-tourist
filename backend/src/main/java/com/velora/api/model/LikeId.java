package com.velora.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

/**
 * Composite primary key for the {@link Like} entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeId implements Serializable {

    private UUID post;
    private UUID user;
}
