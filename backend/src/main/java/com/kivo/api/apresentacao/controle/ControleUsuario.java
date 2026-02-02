package com.kivo.api.apresentacao.controle;

import com.kivo.api.aplicacao.dto.UsuarioEntradaDTO;
import com.kivo.api.aplicacao.dto.UsuarioSaidaDTO;
import com.kivo.api.aplicacao.servico.ServicoUsuario;
import com.kivo.api.dominio.modelo.Usuario;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class ControleUsuario {

    @Autowired
    private ServicoUsuario service;

    @PostMapping
    public ResponseEntity<UsuarioSaidaDTO> criar(@RequestBody @Valid UsuarioEntradaDTO dados) {
        Usuario usuario = service.cadastrar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(usuario));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioSaidaDTO>> listar() {
        List<Usuario> usuarios = service.listar();

        List<UsuarioSaidaDTO> response = usuarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioSaidaDTO> buscar(@PathVariable UUID id) {
        Usuario usuario = service.buscar(id);
        return ResponseEntity.ok(toDTO(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioSaidaDTO> atualizar(@PathVariable UUID id, @RequestBody UsuarioEntradaDTO dados) {
        Usuario usuario = service.atualizarUsuario(id, dados);
        return ResponseEntity.ok(toDTO(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadUsuarios(@RequestParam("file") MultipartFile file) {
        service.importarUsuariosPorExcel(file);
        return ResponseEntity.ok("Upload realizado com sucesso! Verifique os logs para detalhes.");
    }

    private UsuarioSaidaDTO toDTO(Usuario usuario) {
        return new UsuarioSaidaDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpf()
        );
    }
}