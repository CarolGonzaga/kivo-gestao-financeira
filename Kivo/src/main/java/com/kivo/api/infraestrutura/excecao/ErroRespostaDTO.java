package com.kivo.api.infraestrutura.excecao;

import java.util.List;

public record ErroRespostaDTO(
        String mensagem,
        List<ValidationError> errosValidacao
) {
    public ErroRespostaDTO(String mensagem) {
        this(mensagem, null);
    }

    public record ValidationError(String campo, String erro) {}
}