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

@Service
@RequiredArgsConstructor // ✅ Lombok auto-inject
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        log.info("=== CloudinaryService.uploadFile START ===");
        log.info("Folder: {}, File: {}", folder, file.getOriginalFilename());

        try {
            String publicId = UUID.randomUUID().toString();

            String resourceType = "auto";
            if ("application/pdf".equals(file.getContentType())) {
                resourceType = "raw";
                publicId += ".pdf";
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", resourceType,
                            "folder", folder,
                            "type", "upload",
                            "access_mode", "public"));

            String url = (String) uploadResult.get("secure_url");
            log.info("✅ File uploaded to Cloudinary: {}", url);
            return url;

        } catch (IOException e) {
            log.error("❌ Cloudinary upload failed", e);
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("✅ File deleted from Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.error("❌ Failed to delete file", e);
        }
    }

    private String extractPublicId(String fileUrl) {
        String[] parts = fileUrl.split("/upload/");
        if (parts.length > 1) {
            String afterUpload = parts[1];
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
