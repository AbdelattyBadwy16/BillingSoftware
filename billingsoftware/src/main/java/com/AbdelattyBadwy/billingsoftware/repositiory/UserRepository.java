package com.AbdelattyBadwy.billingsoftware.repositiory;

import com.AbdelattyBadwy.billingsoftware.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser,Long> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByUserId(String userId);
}
