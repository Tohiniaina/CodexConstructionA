package codex.evaluation.security.services;

import codex.evaluation.model.UserAdmin;
import codex.evaluation.model.UserClient;
import codex.evaluation.repository.UserAdminRepository;
import codex.evaluation.repository.UserClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  private UserClientRepository userClientRepository;

  @Autowired
  private UserAdminRepository userAdminRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    if (username.matches("\\d+")) { // Assuming userClient usernames are numeric
      UserClient userClient = userClientRepository.findByNumero(username)
              .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
      return new UserDetailsImpl(userClient);
    } else {
      UserAdmin userAdmin = userAdminRepository.findByUsername(username)
              .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
      return new UserDetailsImpl(userAdmin);
    }
  }
}
