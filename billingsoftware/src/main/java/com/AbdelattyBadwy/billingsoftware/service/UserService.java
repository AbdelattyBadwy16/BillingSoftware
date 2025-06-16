package com.AbdelattyBadwy.billingsoftware.service;


import com.AbdelattyBadwy.billingsoftware.io.UserRequest;
import com.AbdelattyBadwy.billingsoftware.io.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    String getUserRole(String email);
    List<UserResponse> readUsers();
    void deleteUser(String id);
}
