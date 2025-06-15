package com.AbdelattyBadwy.billingsoftware.service.impl;

import com.AbdelattyBadwy.billingsoftware.entity.Category;
import com.AbdelattyBadwy.billingsoftware.io.CategoryRequest;
import com.AbdelattyBadwy.billingsoftware.io.CategoryResponse;
import com.AbdelattyBadwy.billingsoftware.repositiory.CategoryRepository;
import com.AbdelattyBadwy.billingsoftware.service.CategoryService;
import com.AbdelattyBadwy.billingsoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;

    @Override
    public CategoryResponse add(CategoryRequest request, MultipartFile file) {
        Category newCategory = convertToEntity(request);
        newCategory.setImgUrl(fileUploadService.uploadFile(file));
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> convertToResponse(category))
                .collect(Collectors.toList());
    }

    @Override
    public void delete(String id) {
        categoryRepository.delete(categoryRepository.findByCategoryId(id).orElseThrow(()->new RuntimeException("Category Not Found")));
        fileUploadService.deleteFile(categoryRepository.findByCategoryId(id).get().getImgUrl());
    }

    private CategoryResponse convertToResponse(Category newCategory) {
        return CategoryResponse.builder()
                .CategoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .imgUrl(newCategory.getImgUrl())
                .bgColor(newCategory.getBgColor())
                .description(newCategory.getDescription())
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .build();

    }

    private Category convertToEntity(CategoryRequest request) {
        return Category.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor())
                .build();
    }
}
