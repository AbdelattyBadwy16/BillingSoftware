package com.AbdelattyBadwy.billingsoftware.service;

import com.AbdelattyBadwy.billingsoftware.entity.Item;
import com.AbdelattyBadwy.billingsoftware.io.ItemRequest;
import com.AbdelattyBadwy.billingsoftware.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    ItemResponse add(ItemRequest request, MultipartFile file);
    List<ItemResponse>fetchItem();
    void deleteItem(String id);
}
