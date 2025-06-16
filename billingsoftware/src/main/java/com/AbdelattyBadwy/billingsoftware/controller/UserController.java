package com.AbdelattyBadwy.billingsoftware.controller;

import com.AbdelattyBadwy.billingsoftware.io.UserRequest;
import com.AbdelattyBadwy.billingsoftware.io.UserResponse;
import com.AbdelattyBadwy.billingsoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody UserRequest request){
        try{
            return userService.createUser(request);
        }catch (Exception exception){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"unable to create user " + exception.getMessage());
        }
    }


    @GetMapping("/users")
    public List<UserResponse> readUsers(){
        return userService.readUsers();
    }


    @DeleteMapping("/users/{id}")
    private void deleteUser(@PathVariable String id){
        try{
            userService.deleteUser(id);
        }catch (Exception ex){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found");
        }
    }
}
