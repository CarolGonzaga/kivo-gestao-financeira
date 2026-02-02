package com.kivo.api.infraestrutura.mensageria;

import com.kivo.api.dominio.modelo.Transacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class ProdutorTransacao {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${topic.name.transacao}")
    private String topicoTransacao;

    public void enviarEvento(Transacao transacao) {
        try {
            kafkaTemplate.send(topicoTransacao, transacao);

            System.out.println("KAFKA PRODUCER: Mensagem enviada para o tópico " + topicoTransacao);
        } catch (Exception e) {
            System.err.println("ERRO KAFKA: Falha ao enviar mensagem: " + e.getMessage());
        }
    }
}