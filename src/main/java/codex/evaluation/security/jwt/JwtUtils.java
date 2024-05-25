package codex.evaluation.security.jwt;

import codex.evaluation.security.services.UserDetailsImpl;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${codex.app.secretKey}")
  private String jwtSecret;

  @Value("${codex.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generateJwtToken(UserDetailsImpl userPrincipal) {
    
    Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
    return JWT.create()
            .withSubject((userPrincipal.getUsername()))
            .withIssuedAt(new Date())
            .withExpiresAt(new Date((new Date()).getTime() + jwtExpirationMs))
            .sign(algorithm);
  }
  
  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String getUserNameFromJwtToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        return decoded.getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT verify = verifier.verify(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }
}
