package com.AbdelattyBadwy.billingsoftware.service.impl;

import com.AbdelattyBadwy.billingsoftware.entity.AppUser;
import com.AbdelattyBadwy.billingsoftware.repositiory.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user =  userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Email not found"));
        return new User(user.getEmail(),user.getPassword(), Collections.singleton(new SimpleGrantedAuthority(user.getRole())));
    }
}
