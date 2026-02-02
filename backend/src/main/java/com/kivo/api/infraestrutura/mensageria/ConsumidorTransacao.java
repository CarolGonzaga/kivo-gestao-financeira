package com.kivo.api.infraestrutura.mensageria;

import com.kivo.api.dominio.modelo.StatusTransacao;
import com.kivo.api.dominio.modelo.Transacao;
import com.kivo.api.dominio.repositorio.RepositorioTransacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ConsumidorTransacao {

    @Autowired
    private RepositorioTransacao repository;

    @RetryableTopic(
            attempts = "3",
            backoff = @Backoff(delay = 1000, multiplier = 2.0),
            autoCreateTopics = "true",
            dltTopicSuffix = ".dlq"
    )
    @KafkaListener(topics = "${topic.name.transacao}", groupId = "beca-processador-transacao")
    @Transactional
    public void processarTransacao(Transacao transacaoPayload) {
        System.out.println("PROCESSOR: Recebida transação ID: " + transacaoPayload.getId());

        Transacao transacao = repository.findById(transacaoPayload.getId())
                .orElseThrow(() -> new RuntimeException("Transação não encontrada no banco"));

        try {
            transacao.setStatus(StatusTransacao.APPROVED);

            System.out.println("PROCESSOR: Transação " + transacao.getTipo() + " processada e APROVADA ✅");

        } catch (Exception e) {
            System.err.println("PROCESSOR: Erro inesperado: " + e.getMessage());
            throw e;
        }

        repository.save(transacao);
    }

    @DltHandler
    public void processarDLQ(Transacao transacao, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        System.err.println("DLQ ALERTA 🚨: Transação falhou e foi para: " + topic);

        Transacao t = repository.findById(transacao.getId()).orElse(null);
        if (t != null) {
            t.setStatus(StatusTransacao.ERROR);
            repository.save(t);
        }
    }
}