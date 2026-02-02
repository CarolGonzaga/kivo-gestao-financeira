package com.kivo.api.aplicacao.dto;

import java.math.BigDecimal;

public record SaldoExternoDTO(
        String id,
        String usuarioId,
        BigDecimal saldo
) {}