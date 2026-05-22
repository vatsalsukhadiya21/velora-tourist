package com.velora.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.velora.api.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Service for uploading and deleting images via Cloudinary.
 */
@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    /**
     * Uploads an image file to Cloudinary under the "velora" folder.
     *
     * @param file the image file to upload
     * @return the secure URL of the uploaded image
     * @throws BadRequestException if the upload fails
     */
    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file) {
        try {
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "velora")
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }

    /**
     * Deletes an image from Cloudinary by its public ID.
     *
     * @param publicId the Cloudinary public ID of the image
     */
    @SuppressWarnings("unchecked")
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new BadRequestException("Failed to delete image: " + e.getMessage());
        }
    }
}
