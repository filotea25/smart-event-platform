package agenda.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import agenda.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
}