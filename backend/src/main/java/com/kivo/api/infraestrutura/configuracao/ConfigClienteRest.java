package com.kivo.api.infraestrutura.configuracao;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class ConfigClienteRest {

    @Bean
    public RestClient brasilApiRestClient() {
        return RestClient.builder()
                .baseUrl("https://brasilapi.com.br/api")
                .build();
    }
}