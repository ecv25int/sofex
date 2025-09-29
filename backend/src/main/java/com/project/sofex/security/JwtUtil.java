package com.project.sofex.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.project.sofex.repository.UserRepository;
import com.project.sofex.model.User;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String jwtSecret = "mySecretKeyForJwtThatIsLongEnough1234567890";
    private final long jwtExpirationMs = 3600000; // 1 hour
    private final Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

    @Autowired
    private UserRepository userRepository;

    public String generateToken(String username) {
        // Add roles to JWT claims
        User user = userRepository.findByUsername(username).orElse(null);
        String[] roles = new String[]{};
        if (user != null && user.getRoles() != null) {
            roles = user.getRoles().stream().map(r -> r.getName()).toArray(String[]::new);
        }
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
