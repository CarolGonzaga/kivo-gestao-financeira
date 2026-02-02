package com.kivo.api.aplicacao.servico;

import com.kivo.api.dominio.modelo.Usuario;
import com.kivo.api.dominio.repositorio.RepositorioUsuario;
import com.kivo.api.aplicacao.dto.UsuarioEntradaDTO;
import com.kivo.api.infraestrutura.cliente.ClienteSaldoMock;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class ServicoUsuario {

    @Autowired
    private RepositorioUsuario repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClienteSaldoMock mockSaldoClient;

    @Transactional
    public Usuario cadastrar(UsuarioEntradaDTO dados) {
        if (repository.existsByEmail(dados.email())) {
            throw new RuntimeException("Email já cadastrado");
        }
        if (repository.existsByCpf(dados.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        Usuario novoUsuario = new Usuario(
                dados.nome(),
                dados.email(),
                senhaCriptografada,
                dados.cpf()
        );

        Usuario usuarioSalvo = repository.save(novoUsuario);
        BigDecimal saldoInicial = gerarSaldoInicialAleatorio();
        mockSaldoClient.criarConta(usuarioSalvo.getId().toString(), saldoInicial);

        return usuarioSalvo;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario buscar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
    }

    @Transactional
    public Usuario atualizarUsuario(UUID id, UsuarioEntradaDTO dados) {
        Usuario usuario = buscar(id);

        usuario.setNome(dados.nome());
        usuario.setEmail(dados.email());
        usuario.setSenha(passwordEncoder.encode(dados.senha()));

        return repository.save(usuario);
    }

    @Transactional
    public void remover(UUID id) {
        Usuario usuario = buscar(id);
        repository.delete(usuario);
    }

    @Transactional
    public void importarUsuariosPorExcel(org.springframework.web.multipart.MultipartFile arquivo) {
        try {
            org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(arquivo.getInputStream());
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            org.apache.poi.ss.usermodel.DataFormatter dataFormatter = new org.apache.poi.ss.usermodel.DataFormatter();

            System.out.println("Iniciando leitura do Excel...");

            for (org.apache.poi.ss.usermodel.Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                if (row.getCell(0) == null && row.getCell(1) == null) continue;

                try {
                    String nome = dataFormatter.formatCellValue(row.getCell(0));
                    String email = dataFormatter.formatCellValue(row.getCell(1));
                    String senha = dataFormatter.formatCellValue(row.getCell(2));
                    String cpf = dataFormatter.formatCellValue(row.getCell(3));

                    if (nome.isEmpty() || email.isEmpty() || cpf.isEmpty()) {
                        continue;
                    }

                    UsuarioEntradaDTO dto = new UsuarioEntradaDTO(nome, email, senha, cpf);
                    cadastrar(dto);
                    System.out.println("Usuário criado via Excel: " + nome);

                } catch (Exception e) {
                    System.err.println("Erro na linha " + row.getRowNum() + ": " + e.getMessage());
                }
            }
            workbook.close();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar arquivo Excel: " + e.getMessage());
        }
    }

    private BigDecimal gerarSaldoInicialAleatorio() {
        double min = 1000.0;
        double max = 10000.0;
        double randomValue = min + (Math.random() * (max - min));
        return BigDecimal.valueOf(randomValue).setScale(2, RoundingMode.HALF_UP);
    }
}