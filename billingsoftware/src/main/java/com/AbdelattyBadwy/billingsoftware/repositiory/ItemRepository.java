package com.AbdelattyBadwy.billingsoftware.repositiory;

import com.AbdelattyBadwy.billingsoftware.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item,Long> {
    Optional<Item> findByItemId(String id);
    List<Item> findByCategory_CategoryId(String CategoryId);
    Integer countByCategoryId(Long id);
}
