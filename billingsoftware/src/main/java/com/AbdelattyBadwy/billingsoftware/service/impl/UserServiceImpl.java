package com.AbdelattyBadwy.billingsoftware.service.impl;

import com.AbdelattyBadwy.billingsoftware.entity.AppUser;
import com.AbdelattyBadwy.billingsoftware.io.UserRequest;
import com.AbdelattyBadwy.billingsoftware.io.UserResponse;
import com.AbdelattyBadwy.billingsoftware.repositiory.UserRepository;
import com.AbdelattyBadwy.billingsoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserResponse createUser(UserRequest request) {
        AppUser user = convertToEntity(request);
        userRepository.save(user);
        return convertToResponse(user);
    }

    private UserResponse convertToResponse(AppUser user) {
        return UserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getUserId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .role(user.getRole())
                .build();
    }

    private AppUser convertToEntity(UserRequest request) {
        return AppUser.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .name(request.getName())
                .build();
    }

    @Override
    public String getUserRole(String email) {
       AppUser user =  userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
       return user.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(user->convertToResponse(user))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        AppUser usr = userRepository.findByUserId(id)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
        userRepository.delete(usr);
    }
}
