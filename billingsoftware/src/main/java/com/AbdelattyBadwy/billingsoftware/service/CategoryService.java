package com.AbdelattyBadwy.billingsoftware.service;

import com.AbdelattyBadwy.billingsoftware.entity.Category;
import com.AbdelattyBadwy.billingsoftware.io.CategoryRequest;
import com.AbdelattyBadwy.billingsoftware.io.CategoryResponse;
import com.AbdelattyBadwy.billingsoftware.io.ItemRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile file);
    List<CategoryResponse> read();
    void delete(String id);
}
