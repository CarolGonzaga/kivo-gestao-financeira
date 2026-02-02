package com.kivo.api.dominio.repositorio;

import com.kivo.api.aplicacao.dto.AnaliseCategoriaDTO;
import com.kivo.api.aplicacao.dto.AnaliseDiariaDTO;
import com.kivo.api.dominio.modelo.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface RepositorioTransacao extends JpaRepository<Transacao, UUID> {

    @Query("SELECT t FROM Transacao t WHERE t.usuario.id = :usuarioId OR t.destinatario.id = :usuarioId ORDER BY t.data DESC")
    List<Transacao> findHistoricoCompleto(@Param("usuarioId") UUID usuarioId);

    @Query("""
        SELECT new com.kivo.api.aplicacao.dto.AnaliseDiariaDTO(
            CAST(t.data AS LocalDate),
            SUM(t.valor)
        )
        FROM Transacao t
        WHERE (t.usuario.id = :usuarioId OR t.destinatario.id = :usuarioId)
        AND t.data BETWEEN :inicio AND :fim
        GROUP BY CAST(t.data AS LocalDate)
        ORDER BY CAST(t.data AS LocalDate) ASC
    """)
    List<AnaliseDiariaDTO> agruparPorData(
            @Param("usuarioId") UUID usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query("""
        SELECT new com.kivo.api.aplicacao.dto.AnaliseCategoriaDTO(
            t.categoria,
            SUM(t.valor)
        )
        FROM Transacao t
        WHERE (t.usuario.id = :usuarioId OR t.destinatario.id = :usuarioId)
        AND t.data BETWEEN :inicio AND :fim
        GROUP BY t.categoria
    """)
    List<AnaliseCategoriaDTO> agruparPorCategoria(
            @Param("usuarioId") UUID usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );
}