package com.kivo.api.aplicacao.dto;

import java.util.UUID;

public record UsuarioSaidaDTO(
        UUID id,
        String nome,
        String email,
        String cpf
) {}