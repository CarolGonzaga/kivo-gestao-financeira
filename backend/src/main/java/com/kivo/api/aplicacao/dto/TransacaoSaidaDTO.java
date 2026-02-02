package com.kivo.api.aplicacao.dto;

import com.kivo.api.dominio.modelo.CategoriaTransacao;
import com.kivo.api.dominio.modelo.StatusTransacao;
import com.kivo.api.dominio.modelo.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransacaoSaidaDTO(
        UUID id,
        BigDecimal valor,
        TipoTransacao tipo,
        CategoriaTransacao categoria,
        StatusTransacao status,
        BigDecimal taxaCambio,
        LocalDateTime data
) {}