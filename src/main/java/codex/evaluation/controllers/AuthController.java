package codex.evaluation.controllers;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import codex.evaluation.model.*;
import codex.evaluation.repository.UserAdminRepository;
import codex.evaluation.security.Encryptor;
import codex.evaluation.security.jwt.JwtUtils;
import codex.evaluation.security.services.UserDetailsImpl;
import codex.evaluation.service.UserAdminService;
import codex.evaluation.service.UserClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/codexconstruction/auth")
public class AuthController {
  @Autowired
  private UserClientService userClientService;

  @Autowired
  private UserAdminService userAdminService;

  @Autowired
  UserAdminRepository userAdminRepository;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  PasswordEncoder encoder;

  @GetMapping("loginadmin")
  public ModelAndView LoginAdmin(){
    ModelAndView modelAndView = new ModelAndView("LoginAdmin");
    return modelAndView;
  }

  @GetMapping("loginclient")
  public ModelAndView LoginClient(){
    ModelAndView modelAndView = new ModelAndView("LoginClient");
    return modelAndView;
  }

  @GetMapping("/inscriAdmin")
  public String inscri(Model model){
    return "inscri";
  }

  @PostMapping("/authenticateadmin")
  public ResponseEntity<?> authenticateAdmin(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
    Map<String, String> response = new HashMap<>();
    Optional<UserAdmin> user = userAdminRepository.findByEmail(authenticationRequest.getUsername());

    try {
      if (user.isEmpty()) {
        throw new Exception("Email or Password invalid");
      }
      if(user.isPresent() && encoder.matches(authenticationRequest.getPassword(), user.get().getPassword()) == false) {
        throw new Exception("Email or Password invalid");
      }
    } catch (Exception e) {
      System.out.println(e.getMessage());
      response.put("Message", "Une erreur s'est produit");
      response.put("error", e.getMessage());
      response.put("status", "NOT OK");
      return ResponseEntity.ok(response);
    }
    UserDetailsImpl userDetails = new UserDetailsImpl(user.get());

    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    // Définissez l'authentification dans le contexte de sécurité
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(userDetails);

    List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            roles));
  }

  @PostMapping("/authenticateclient")
  public ResponseEntity<?> authenticateClient(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
    Map<String, String> response = new HashMap<>();

    Optional<UserClient> user = userClientService.findByNumero(authenticationRequest.getUsername());
    UserClient userClient = new UserClient();
    try {
      if (user.isEmpty()) {
        userClient = userClientService.save(new UserClient(authenticationRequest.getUsername()));
      } else {
        userClient = user.get();
      }
    } catch (Exception e) {
      response.put("Message", "Une erreur s'est produit");
      response.put("error", e.getMessage());
      response.put("status", "NOT OK");
      return ResponseEntity.ok(response);
    }
    UserDetailsImpl userDetails = new UserDetailsImpl(userClient);

    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    // Définissez l'authentification dans le contexte de sécurité
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(userDetails);

    List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            roles));
  }

  @PostMapping("/signupAdmin")
  public ResponseEntity<Map<String, String>> registerUser(@RequestParam("nom") String nom, @RequestParam("email") String email, @RequestParam("password") String password) {
    System.out.println("Email : "+email);
    Map<String, String> response = new HashMap<>();
    try {
      if (userAdminRepository.existsByUsername(nom)) {
        throw new Exception("Error: Username is already taken!");
      }

      if (userAdminRepository.existsByEmail(email)) {
        throw new Exception("Error: Email is already in use!");
      }

      UserAdmin user = new UserAdmin(nom,
              email,
              encoder.encode(password)
              );
      userAdminRepository.save(user);
    } catch (Exception e) {
      response.put("Message", "Une erreur s'est produit");
      response.put("error", e.getMessage());
      response.put("status", "NOT OK");
      return ResponseEntity.ok(response);
    }
    response.put("message", "Inscription reussi");
    response.put("status", "OK");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/logout")
  public String logout(HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }
    return "redirect:/codexconstruction";
  }
}
