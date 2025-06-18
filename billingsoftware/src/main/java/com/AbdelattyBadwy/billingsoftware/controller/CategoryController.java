package com.AbdelattyBadwy.billingsoftware.controller;

import com.AbdelattyBadwy.billingsoftware.io.CategoryRequest;
import com.AbdelattyBadwy.billingsoftware.io.CategoryResponse;
import com.AbdelattyBadwy.billingsoftware.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    @PostMapping("/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString, @RequestPart("file")MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try{
            request = objectMapper.readValue(categoryString,CategoryRequest.class);
            return categoryService.add(request,file);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Ex occured while Parsing the json " + e.getMessage());
        }

    }

    @GetMapping("/categories")
    public List<CategoryResponse> allCategories(){
        return categoryService.read();
    }

    @DeleteMapping("/admin/categories/{categoryId}")
    public void delete(@PathVariable String categoryId){
        try {
             categoryService.delete(categoryId);
        }catch (Exception e){
             throw new ResponseStatusException(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }
}
