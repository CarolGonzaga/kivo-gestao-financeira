package com.kivo.api.infraestrutura.springdoc;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI configuracaoOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Kivo - API de Gestão Financeira")
                        .description("""
                    API responsável pelo gerenciamento financeiro de usuários.
                    
                    Funcionalidades principais:
                    - CRUD de usuários
                    - CRUD de transações financeiras
                    - Análise de despesas por período e categoria
                    - Integração com API de câmbio
                    - Integração com saldo bancário via MockAPI
                    - Exportação de relatórios em PDF e Excel
                    """)
                        .version("1.0.0")
                );
    }
}