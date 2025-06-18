package com.AbdelattyBadwy.billingsoftware.service.impl;

import com.AbdelattyBadwy.billingsoftware.entity.Category;
import com.AbdelattyBadwy.billingsoftware.entity.Item;
import com.AbdelattyBadwy.billingsoftware.io.ItemRequest;
import com.AbdelattyBadwy.billingsoftware.io.ItemResponse;
import com.AbdelattyBadwy.billingsoftware.repositiory.CategoryRepository;
import com.AbdelattyBadwy.billingsoftware.repositiory.ItemRepository;
import com.AbdelattyBadwy.billingsoftware.service.FileUploadService;
import com.AbdelattyBadwy.billingsoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;
    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        Item item = convertToEntity(request);
        Category category = categoryRepository.findByCategoryId(request.getCategoryId())
                .orElseThrow(()->new RuntimeException("Category Not Found "));
        item.setCategory(category);
        item.setImgUrl(imgUrl);
        item = itemRepository.save(item);
        return convertToResponse(item);
    }

    private ItemResponse convertToResponse(Item item) {
       return ItemResponse.builder()
                .itemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imgUrl(item.getImgUrl())
                .categoryName(item.getCategory().getName())
                .categoryId(item.getCategory().getCategoryId())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private Item convertToEntity(ItemRequest request) {
        return Item.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItem() {
        return itemRepository.findAll()
                .stream()
                .map(Item->convertToResponse(Item))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String id) {
        Item item = itemRepository.findByItemId(id)
                .orElseThrow(()-> new RuntimeException("Item not found"));
        itemRepository.delete(item);
    }
}
