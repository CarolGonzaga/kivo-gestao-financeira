package com.kivo.api.aplicacao.dto;

import com.kivo.api.dominio.modelo.CategoriaTransacao;
import com.kivo.api.dominio.modelo.TipoTransacao;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record TransacaoEntradaDTO(
        @NotNull(message = "Valor obrigatório")
        @Positive(message = "Valor deve ser positivo")
        BigDecimal valor,

        @NotNull(message = "Tipo da transação obrigatório")
        TipoTransacao tipo,

        @NotNull(message = "ID do usuário obrigatório")
        UUID usuarioId,

        CategoriaTransacao categoria,

        UUID destinatarioId,

        String moeda
) {
    public TransacaoEntradaDTO {
        if (moeda == null) {
            moeda = "BRL";
        }
        if (categoria == null) {
            categoria = CategoriaTransacao.OUTROS;
        }
    }
}