package com.AbdelattyBadwy.billingsoftware.io;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String role;
    private String userId;
    private String email;
    private String password;
    private String name;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}
