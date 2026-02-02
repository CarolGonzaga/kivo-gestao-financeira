package com.kivo.api.aplicacao.servico;

import com.kivo.api.aplicacao.dto.AnaliseCategoriaDTO;
import com.kivo.api.aplicacao.dto.AnaliseDiariaDTO;
import com.kivo.api.aplicacao.dto.ExtratoDTO;
import com.kivo.api.aplicacao.dto.TransacaoEntradaDTO;
import com.kivo.api.dominio.modelo.StatusTransacao;
import com.kivo.api.dominio.modelo.TipoTransacao;
import com.kivo.api.dominio.modelo.Transacao;
import com.kivo.api.dominio.modelo.Usuario;
import com.kivo.api.dominio.repositorio.RepositorioTransacao;
import com.kivo.api.dominio.repositorio.RepositorioUsuario;
import com.kivo.api.infraestrutura.cliente.ClienteBrasilApi;
import com.kivo.api.infraestrutura.cliente.ClienteSaldoMock;
import com.kivo.api.infraestrutura.mensageria.ProdutorTransacao;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ServicoTransacao {

    private static final Logger log = LoggerFactory.getLogger(ServicoTransacao.class);

    @Autowired
    private RepositorioTransacao repository;

    @Autowired
    private RepositorioUsuario usuarioRepository;

    @Autowired
    private ClienteBrasilApi brasilApiClient;

    @Autowired
    private ClienteSaldoMock mockSaldoClient;

    @Autowired
    private ProdutorTransacao transacaoProducer;

    @Transactional
    public Transacao registrar(TransacaoEntradaDTO dados) {
        log.info("Iniciando registro de transação ({}) - Tipo: {} - Categoria: {} - Usuário: {}",
                dados.moeda(), dados.tipo(), dados.categoria(), dados.usuarioId());

        Usuario usuario = usuarioRepository.findById(dados.usuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Usuario destinatario = buscarDestinatario(dados);
        BigDecimal taxaCambio = obterTaxaCambio(dados.moeda());

        Transacao transacao = new Transacao(
                dados.valor(),
                dados.tipo(),
                dados.categoria(),
                usuario,
                destinatario,
                taxaCambio,
                dados.moeda()
        );
        transacao.setStatus(StatusTransacao.PENDING);

        repository.save(transacao);
        notificarKafka(transacao);

        return transacao;
    }

    public BigDecimal consultarSaldo(UUID usuarioId) {
        return mockSaldoClient.buscarSaldo(usuarioId.toString());
    }

    public ExtratoDTO buscarExtrato(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        BigDecimal saldoMock = mockSaldoClient.buscarSaldo(usuarioId.toString());
        List<Transacao> historico = repository.findHistoricoCompleto(usuarioId);

        return new ExtratoDTO(usuario.getNome(), saldoMock, historico);
    }

    @Transactional(readOnly = true)
    public List<AnaliseDiariaDTO> analisarPeriodo(UUID usuarioId, LocalDate inicio, LocalDate fim) {
        log.info("Gerando análise de período para usuário {} entre {} e {}", usuarioId, inicio, fim);

        var dataInicio = inicio.atStartOfDay();
        var dataFim = fim.atTime(23, 59, 59);

        return repository.agruparPorData(usuarioId, dataInicio, dataFim);
    }

    private Usuario buscarDestinatario(TransacaoEntradaDTO dados) {
        if (dados.tipo() != TipoTransacao.TRANSFERENCIA) {
            return null;
        }

        if (dados.destinatarioId() == null) {
            throw new IllegalArgumentException("Destinatário é obrigatório para transferências");
        }

        if (dados.usuarioId().equals(dados.destinatarioId())) {
            throw new IllegalArgumentException("Remetente e destinatário não podem ser iguais");
        }

        return usuarioRepository.findById(dados.destinatarioId())
                .orElseThrow(() -> new EntityNotFoundException("Destinatário não encontrado"));
    }

    private BigDecimal obterTaxaCambio(String moeda) {
        if (moeda == null || moeda.equalsIgnoreCase("BRL")) {
            return BigDecimal.ONE;
        }

        try {
            var cambio = brasilApiClient.buscarCotacao(moeda);
            return cambio != null ? cambio.valor() : BigDecimal.ZERO;
        } catch (Exception e) {
            log.warn("Falha ao buscar cotação para moeda {}, salvando com taxa 0. Erro: {}", moeda, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private void notificarKafka(Transacao transacao) {
        try {
            transacaoProducer.enviarEvento(transacao);
            log.info("Evento de transação (ID: {}) enviado para o Kafka", transacao.getId());
        } catch (Exception e) {
            log.error("Erro ao enviar evento para o Kafka", e);
        }
    }

    @Transactional(readOnly = true)
    public List<AnaliseCategoriaDTO> analisarPorCategoria(UUID usuarioId, LocalDate inicio, LocalDate fim) {
        var dataInicio = inicio.atStartOfDay();
        var dataFim = fim.atTime(23, 59, 59);

        return repository.agruparPorCategoria(usuarioId, dataInicio, dataFim);
    }
}