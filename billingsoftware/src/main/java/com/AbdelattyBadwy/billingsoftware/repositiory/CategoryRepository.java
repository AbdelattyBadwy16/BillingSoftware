package com.AbdelattyBadwy.billingsoftware.repositiory;

import com.AbdelattyBadwy.billingsoftware.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    Optional<Category> findByCategoryId(String CategoryId);
}
