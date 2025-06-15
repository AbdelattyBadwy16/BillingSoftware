package com.AbdelattyBadwy.billingsoftware.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = ObjectUtils.asMap(
                "cloud_name", "ds1ath8sq",
                "api_key", "748215788517662",
                "api_secret", "dzgaG_FHe3VbGLi4dzfJMa-VF04"
        );
        return new Cloudinary(config);
    }
}
