package com.tutor_management.backend.modules.shared;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Service for managing file uploads and deletions via Cloudinary.
 * Handles both standard media files and document-specific logic (e.g., PDF resource types).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Uploads an external multipart file to Cloudinary.
     *
     * @param file   The multipart file to upload.
     * @param folder The target folder path in Cloudinary.
     * @return The secure URL of the uploaded file.
     * @throws IOException If the upload fails due to network or authentication issues.
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        log.debug("Uploading file {} to folder {}", file.getOriginalFilename(), folder);

        try {
            String publicId = UUID.randomUUID().toString();
            String resourceType = "auto";
            
            // Critical: PDF files must be uploaded as 'raw' to preserve their original formatting
            // and extension in certain Cloudinary configurations.
            if ("application/pdf".equals(file.getContentType())) {
                resourceType = "raw";
                publicId += ".pdf";
            }

            @SuppressWarnings("rawtypes")
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", resourceType,
                            "folder", folder,
                            "type", "upload",
                            "access_mode", "public"));

            String url = (String) uploadResult.get("secure_url");
            log.info("Successfully uploaded file to Cloudinary: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: {}", file.getOriginalFilename(), e);
            throw new IOException("Lỗi khi tải tệp lên Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes a file from Cloudinary based on its full URL.
     *
     * @param fileUrl The full secure URL of the file to delete.
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;
        
        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Successfully deleted file from Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete file from Cloudinary: {}", fileUrl, e);
        }
    }

    /**
     * Extracts the Cloudinary public ID from a full delivery URL.
     */
    private String extractPublicId(String fileUrl) {
        String[] parts = fileUrl.split("/upload/");
        if (parts.length > 1) {
            String afterUpload = parts[1];
            // Remove the version segment (e.g., v12345678/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            int dotIndex = withoutVersion.lastIndexOf('.');
            if (dotIndex > 0) {
                return withoutVersion.substring(0, dotIndex);
            }
            return withoutVersion;
        }
        return fileUrl;
    }
}
