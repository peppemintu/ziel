package com.greendal.ziel.auth.repository;

import com.greendal.ziel.auth.model.User;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends ListCrudRepository<User, Long> {
    User findByEmail(String email);
}
