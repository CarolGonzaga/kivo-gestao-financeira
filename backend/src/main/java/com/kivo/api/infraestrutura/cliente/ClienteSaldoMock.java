package com.kivo.api.infraestrutura.cliente;

import com.kivo.api.aplicacao.dto.SaldoExternoDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.math.BigDecimal;
import java.util.List;

@Component
public class ClienteSaldoMock {

    private final RestClient restClient;
    private final String RESOURCE = "/saldoInicial";

    public ClienteSaldoMock() {
        String baseUrl = "https://697aa3ae0e6ff62c3c59d0e6.mockapi.io/api/v1";
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public void criarConta(String usuarioId, BigDecimal saldoInicial) {
        try {
            SaldoExternoDTO novaConta = new SaldoExternoDTO(null, usuarioId, saldoInicial);

            restClient.post()
                    .uri(RESOURCE)
                    .body(novaConta)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("DEBUG: Conta criada no MockAPI com saldo R$ " + saldoInicial);
        } catch (Exception e) {
            System.err.println("ERRO MOCKAPI POST: " + e.getMessage());
        }
    }

    public BigDecimal buscarSaldo(String usuarioId) {
        try {
            List<SaldoExternoDTO> contas = restClient.get()
                    .uri(RESOURCE + "?usuarioId=" + usuarioId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<SaldoExternoDTO>>() {});

            if (contas != null && !contas.isEmpty()) {
                return contas.get(0).saldo();
            }
            return BigDecimal.ZERO;
        } catch (Exception e) {
            System.err.println("ERRO MOCKAPI GET: " + e.getMessage());
            return BigDecimal.ZERO;
        }
    }
}