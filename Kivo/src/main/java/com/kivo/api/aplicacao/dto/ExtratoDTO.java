package com.kivo.api.aplicacao.dto;

import com.kivo.api.dominio.modelo.Transacao;

import java.math.BigDecimal;
import java.util.List;

public record ExtratoDTO(
        String usuario,
        BigDecimal saldoAtual,
        List<Transacao> transacoes
) {}