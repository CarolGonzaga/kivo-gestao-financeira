package com.kivo.api.aplicacao.dto;

import com.kivo.api.dominio.modelo.CategoriaTransacao;
import java.math.BigDecimal;

public record AnaliseCategoriaDTO(
        CategoriaTransacao categoria,
        BigDecimal total
) {}