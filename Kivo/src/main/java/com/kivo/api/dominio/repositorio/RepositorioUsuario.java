package com.kivo.api.dominio.repositorio;

import com.kivo.api.dominio.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface RepositorioUsuario extends JpaRepository<Usuario, UUID> {
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    UserDetails findByEmail(String email);
}