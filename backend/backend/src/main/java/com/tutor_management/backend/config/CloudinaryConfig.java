package com.tutor_management.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        System.out.println("=================================================");
        System.out.println("🔧 CLOUDINARY CONFIGURATION");
        System.out.println("=================================================");
        System.out.println("Cloud Name: " + (cloudName.isEmpty() ? "❌ NOT SET" : "✅ " + cloudName));
        System.out.println("API Key: " + (apiKey.isEmpty() ? "❌ NOT SET" : "✅ " + apiKey.substring(0, Math.min(4, apiKey.length())) + "..."));
        System.out.println("API Secret: " + (apiSecret.isEmpty() ? "❌ NOT SET" : "✅ " + apiSecret.substring(0, Math.min(4, apiSecret.length())) + "..."));
        System.out.println("=================================================");

        if (cloudName.isEmpty() || apiKey.isEmpty() || apiSecret.isEmpty()) {
            System.err.println("❌ ERROR: Cloudinary credentials are missing!");
            System.err.println("   Please check Railway environment variables:");
            System.err.println("   - CLOUDINARY_CLOUD_NAME");
            System.err.println("   - CLOUDINARY_API_KEY");
            System.err.println("   - CLOUDINARY_API_SECRET");
            throw new RuntimeException("Cloudinary credentials are not configured!");
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");

        Cloudinary cloudinary = new Cloudinary(config);

        System.out.println("✅ Cloudinary initialized successfully!");
        System.out.println("=================================================");

        return cloudinary;
    }
}