package com.AbdelattyBadwy.billingsoftware.controller;

import com.AbdelattyBadwy.billingsoftware.io.ItemRequest;
import com.AbdelattyBadwy.billingsoftware.io.ItemResponse;
import com.AbdelattyBadwy.billingsoftware.service.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @PostMapping("/admin/items")
    public ItemResponse addItem(@RequestPart("item")String item, @RequestPart("file")MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        ItemRequest itemRequest = null;
        try{
            itemRequest = objectMapper.readValue(item,ItemRequest.class);
            return itemService.add(itemRequest,file);
        }catch (Exception ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,ex.getMessage());
        }
    }

    @GetMapping("/items")
    public List<ItemResponse> readItems(){
        return itemService.fetchItem();
    }

    @GetMapping("/items/{id}")
    public List<ItemResponse> getItemsByCategories(@PathVariable String id){
        return itemService.getByCategoryId(id);
    }


    @DeleteMapping("/admin/items/{id}")
    public void removeItem(@PathVariable String id){
        try {
            itemService.deleteItem(id);
        }catch (Exception ex){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,ex.getMessage());
        }
    }
}
