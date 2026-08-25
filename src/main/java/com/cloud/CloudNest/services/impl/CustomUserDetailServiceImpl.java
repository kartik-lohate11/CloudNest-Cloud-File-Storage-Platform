package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.UserDataPrinciple;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.exception.UserNotFoundException;
import com.cloud.CloudNest.repository.UserDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailServiceImpl implements UserDetailsService {

    private final UserDataRepository userDataRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        {
            UserData userData = userDataRepository.findByMail(username);
            if (userData != null) {
                log.info(username + " Found");
                return new UserDataPrinciple(userData);
            }
            throw new UserNotFoundException("Invalid credentials for user " + username);
        }
    }
}
