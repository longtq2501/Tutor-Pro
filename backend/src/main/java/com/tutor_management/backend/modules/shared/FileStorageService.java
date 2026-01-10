package com.tutor_management.backend.modules.shared;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

import static javax.swing.UIManager.getString;


/**
 * Service for local file system storage operations.
 * Handles storing, loading, and deleting files within the configured upload directory.
 */
@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    /**
     * Initializes the storage location.
     * Starts with a default directory if not specified in properties.
     */
    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Không thể tạo thư mục lưu trữ tệp tin!", ex);
        }
    }

    /**
     * Stores a file to the local file system.
     * Generates a unique UUID filename to prevent collisions.
     *
     * @param file The file to store.
     * @return The unique filename generated.
     */
    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            // Security check: prevents directory traversal attacks
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Đường dẫn tệp tin không hợp lệ: " + originalFileName);
            }

            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Không thể lưu trữ tệp tin " + originalFileName + ". Lỗi: " + ex.getMessage(), ex);
        }
    }

    /**
     * Loads a file as a {@link Resource} for downloading.
     *
     * @param fileName The unique filename to load.
     * @return The resource corresponding to the file.
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Không tìm thấy tệp tin: " + fileName);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi khi tải tệp tin: " + fileName, ex);
        }
    }

    /**
     * Deletes a file from the local storage.
     *
     * @param fileName The unique filename to delete.
     */
    public void deleteFile(String fileName) {
        if (fileName == null || fileName.isBlank()) return;
        
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Không thể xóa tệp tin: " + fileName, ex);
        }
    }

    /**
     * Formats file size in bytes to a human-readable string (e.g., KB, MB).
     */
    public String formatFileSize(long size) {
        return getString(size);
    }
}
