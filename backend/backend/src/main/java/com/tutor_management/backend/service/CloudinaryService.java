package com.tutor_management.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        try {
            // Generate unique filename
            String publicId = folder + "/" + UUID.randomUUID().toString();

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto"
                    )
            );

            String url = (String) uploadResult.get("secure_url");
            System.out.println("✅ File uploaded to Cloudinary: " + url);
            return url;

        } catch (IOException e) {
            System.err.println("❌ Cloudinary upload failed: " + e.getMessage());
            throw new IOException("Failed to upload file to Cloudinary", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("✅ File deleted from Cloudinary: " + publicId);
        } catch (Exception e) {
            System.err.println("❌ Failed to delete file: " + e.getMessage());
        }
    }

    private String extractPublicId(String fileUrl) {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/documents/abc-def.pdf
        // Extract: documents/abc-def
        String[] parts = fileUrl.split("/upload/");
        if (parts.length > 1) {
            String afterUpload = parts[1];
            // Remove version (v1234567890/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            // Remove extension
            int dotIndex = withoutVersion.lastIndexOf('.');
            if (dotIndex > 0) {
                return withoutVersion.substring(0, dotIndex);
            }
            return withoutVersion;
        }
        return fileUrl;
    }
}