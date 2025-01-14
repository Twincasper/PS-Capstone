package com.nimbus.backend.service;

import com.nimbus.backend.model.Post;
import com.nimbus.backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(String username, String password);

    List<User> getAllUsers();
    List<Post> getPostsByUser(Integer userId);
    Optional<User> getUserById(Integer id);
    Optional<User> findByUsername(String username);
    boolean usernameExists(String username);

    User updateUser(Integer id, User userDetails);

    void deleteUser(Integer id);
}