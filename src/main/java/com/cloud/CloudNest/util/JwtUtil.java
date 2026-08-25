package com.cloud.CloudNest.util;

import com.cloud.CloudNest.dto.UserDataPrinciple;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

public class JwtUtil {

    private static String setSigningKey = "";
    private static final long EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

    static {
        try {
            KeyGenerator key = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey = key.generateKey();
            setSigningKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getToken(UserDataPrinciple userData) {
        return Jwts.builder()
                .claim("roles", userData.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList())
                .setSubject(userData.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 10 min
                .signWith(getKey())
                .compact();
    }

    public static String getToken(String userName) {
        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 10 min
                .signWith(getKey())
                .compact();
    }

    public static Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private static <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public static String extractUserName(String token) {
        // extract the username from jwt token
        return extractClaim(token, Claims::getSubject);
    }

    public static boolean validateToken(String token) {
        final String userName = extractUserName(token);
        return userName!=null && !isTokenExpired(token);
    }

    private static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private static Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private static SecretKey getKey() {
        byte[] arr = Base64.getDecoder().decode(setSigningKey.getBytes());
        return Keys.hmacShaKeyFor(arr);
    }
}
