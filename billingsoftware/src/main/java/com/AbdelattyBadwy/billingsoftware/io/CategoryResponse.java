package com.AbdelattyBadwy.billingsoftware.io;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class CategoryResponse {
    private String CategoryId;
    private String name;
    private String description;
    private String bgColor;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String imgUrl;
}
