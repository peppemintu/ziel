package com.greendal.ziel.auth.util;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static java.util.concurrent.TimeUnit.DAYS;
import static java.util.concurrent.TimeUnit.MINUTES;

@Component
@Getter
public class Constants {
    @Value("${jwt.secret}")
    String SECRET_KEY;

    final long ACCESS_TOKEN_EXPIRATION = MINUTES.toMillis(15);
    final long REFRESH_TOKEN_EXPIRATION = DAYS.toMillis(7);
}
