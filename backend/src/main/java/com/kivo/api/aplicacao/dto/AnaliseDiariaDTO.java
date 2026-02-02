package com.kivo.api.aplicacao.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AnaliseDiariaDTO(
        LocalDate data,
        BigDecimal total
) {}