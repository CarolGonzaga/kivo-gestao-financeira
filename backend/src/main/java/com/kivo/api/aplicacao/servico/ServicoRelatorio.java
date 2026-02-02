package com.kivo.api.aplicacao.servico;

import com.kivo.api.aplicacao.dto.ExtratoDTO;
import com.kivo.api.dominio.modelo.TipoTransacao;
import com.kivo.api.dominio.modelo.Transacao;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ServicoRelatorio {

    private static final Color AZUL_ESCURO = new Color(18, 28, 45);
    private static final Color AZUL_CLARO = new Color(235, 242, 255);
    private static final Color CINZA_TEXTO = new Color(60, 60, 60);
    private static final Color CINZA_LINHA = new Color(210, 210, 210);
    private static final Color ZEBRA = new Color(248, 248, 248);

    public byte[] gerarExtratoPdf(ExtratoDTO extrato) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 36, 36, 54, 36);
            PdfWriter.getInstance(document, out);

            document.open();

            document.addTitle("Extrato Financeiro - Kivo");
            document.addAuthor("Kivo");

            Font fonteTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.WHITE);
            Font fonteSubtitulo = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(220, 230, 245));
            Font fonteTexto = FontFactory.getFont(FontFactory.HELVETICA, 11, CINZA_TEXTO);
            Font fonteLabel = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, AZUL_ESCURO);
            Font fonteValorPositivo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(18, 120, 55));
            Font fonteValorNegativo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(180, 40, 40));

            PdfPTable cabecalho = new PdfPTable(1);
            cabecalho.setWidthPercentage(100);

            PdfPCell celCab = new PdfPCell();
            celCab.setBackgroundColor(AZUL_ESCURO);
            celCab.setBorder(Rectangle.NO_BORDER);
            celCab.setPadding(16);

            Paragraph pTitulo = new Paragraph("Relatório Financeiro", fonteTitulo);
            pTitulo.setSpacingAfter(6);

            DateTimeFormatter formatoEmissao = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            Paragraph pSub = new Paragraph("Emitido em " + LocalDate.now().format(formatoEmissao), fonteSubtitulo);

            celCab.addElement(pTitulo);
            celCab.addElement(pSub);
            cabecalho.addCell(celCab);

            document.add(cabecalho);
            document.add(Chunk.NEWLINE);

            PdfPTable resumo = new PdfPTable(2);
            resumo.setWidthPercentage(100);
            resumo.setWidths(new float[]{3.2f, 1.8f});

            PdfPCell boxInfo = new PdfPCell();
            boxInfo.setBorderColor(CINZA_LINHA);
            boxInfo.setBorderWidth(1);
            boxInfo.setPadding(12);
            boxInfo.setBackgroundColor(Color.WHITE);

            boxInfo.addElement(new Paragraph("Cliente", fonteLabel));
            boxInfo.addElement(new Paragraph(extrato.usuario(), fonteTexto));
            boxInfo.addElement(Chunk.NEWLINE);

            boxInfo.addElement(new Paragraph("Saldo bancário (externo)", fonteLabel));
            boxInfo.addElement(new Paragraph("R$ " + extrato.saldoAtual(), fonteTexto));

            PdfPCell boxTotais = new PdfPCell();
            boxTotais.setBorderColor(CINZA_LINHA);
            boxTotais.setBorderWidth(1);
            boxTotais.setPadding(12);
            boxTotais.setBackgroundColor(AZUL_CLARO);

            BigDecimal entradas = BigDecimal.ZERO;
            BigDecimal saidas = BigDecimal.ZERO;

            for (Transacao t : extrato.transacoes()) {
                if (t.getTipo() == TipoTransacao.DEPOSITO) {
                    entradas = entradas.add(t.getValor());
                } else if (t.getTipo() == TipoTransacao.SAQUE || t.getTipo() == TipoTransacao.COMPRA) {
                    saidas = saidas.add(t.getValor());
                } else {
                    String nomeDonoExtrato = extrato.usuario();
                    String nomeRemetente = t.getUsuario().getNome();
                    boolean fuiEuQueMandei = nomeRemetente.equalsIgnoreCase(nomeDonoExtrato);
                    if (fuiEuQueMandei) {
                        saidas = saidas.add(t.getValor());
                    } else {
                        entradas = entradas.add(t.getValor());
                    }
                }
            }

            boxTotais.addElement(new Paragraph("Resumo do período", fonteLabel));
            boxTotais.addElement(Chunk.NEWLINE);

            PdfPTable mini = new PdfPTable(2);
            mini.setWidthPercentage(100);
            mini.setWidths(new float[]{1.2f, 1.2f});

            mini.addCell(celMini("Entradas", fonteTexto, Rectangle.NO_BORDER, 6, Color.WHITE));
            mini.addCell(celMini("R$ " + entradas, fonteValorPositivo, Rectangle.NO_BORDER, 6, Color.WHITE));
            mini.addCell(celMini("Saídas", fonteTexto, Rectangle.NO_BORDER, 6, Color.WHITE));
            mini.addCell(celMini("R$ " + saidas, fonteValorNegativo, Rectangle.NO_BORDER, 6, Color.WHITE));

            boxTotais.addElement(mini);

            resumo.addCell(boxInfo);
            resumo.addCell(boxTotais);

            document.add(resumo);
            document.add(Chunk.NEWLINE);

            PdfPTable linha = new PdfPTable(1);
            linha.setWidthPercentage(100);
            PdfPCell celLinha = new PdfPCell(new Phrase(""));
            celLinha.setFixedHeight(1f);
            celLinha.setBorder(Rectangle.NO_BORDER);
            celLinha.setBackgroundColor(CINZA_LINHA);
            linha.addCell(celLinha);
            document.add(linha);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.2f, 2.2f, 4.2f, 2.0f, 2.2f});

            addHeader(table, "Data/Hora");
            addHeader(table, "Categoria");
            addHeader(table, "Tipo / Detalhes");
            addHeader(table, "Moeda / Cotação");
            addHeader(table, "Valor (R$)");

            DateTimeFormatter formatterTabela = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            int i = 0;
            for (Transacao t : extrato.transacoes()) {
                boolean zebra = (i % 2 == 1);

                String catDisplay = (t.getCategoria() != null) ? t.getCategoria().toString() : "OUTROS";

                String detalhesDisplay;
                Font fonteValor;

                String nomeDonoExtrato = extrato.usuario();
                String nomeRemetente = t.getUsuario().getNome();

                if (t.getTipo() == TipoTransacao.DEPOSITO) {
                    fonteValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(18, 120, 55));
                    detalhesDisplay = "DEPÓSITO";
                } else if (t.getTipo() == TipoTransacao.SAQUE) {
                    fonteValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(180, 40, 40));
                    detalhesDisplay = "SAQUE";
                } else if (t.getTipo() == TipoTransacao.COMPRA) {
                    fonteValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(190, 105, 10));
                    detalhesDisplay = "COMPRA";
                } else {
                    boolean fuiEuQueMandei = nomeRemetente.equalsIgnoreCase(nomeDonoExtrato);
                    if (fuiEuQueMandei) {
                        fonteValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(30, 90, 170));
                        String idDestinatario = (t.getDestinatario() != null) ? t.getDestinatario().getId().toString() : "N/A";
                        detalhesDisplay = "TRANSFERÊNCIA (ENVIADA)\nPara: " + idDestinatario;
                    } else {
                        fonteValor = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(140, 110, 10));
                        String idRemetente = t.getUsuario().getId().toString();
                        detalhesDisplay = "TRANSFERÊNCIA (RECEBIDA)\nDe: " + idRemetente;
                    }
                }

                String taxaDisplay;
                BigDecimal taxa = t.getTaxaCambio();
                String moeda = (t.getMoeda() != null) ? t.getMoeda() : "BRL";

                if (taxa == null || taxa.compareTo(BigDecimal.ONE) == 0 || taxa.compareTo(BigDecimal.ZERO) == 0) {
                    taxaDisplay = "BRL (1:1)";
                } else {
                    taxaDisplay = moeda + " " + taxa;
                }

                addCell(table, t.getData().format(formatterTabela), FontFactory.getFont(FontFactory.HELVETICA, 10, CINZA_TEXTO), zebra);
                addCell(table, catDisplay, FontFactory.getFont(FontFactory.HELVETICA, 10, CINZA_TEXTO), zebra);
                addCell(table, detalhesDisplay, FontFactory.getFont(FontFactory.HELVETICA, 10, CINZA_TEXTO), zebra);
                addCell(table, taxaDisplay, FontFactory.getFont(FontFactory.HELVETICA, 10, CINZA_TEXTO), zebra);
                addCell(table, "R$ " + t.getValor(), fonteValor, zebra);

                i++;
            }

            document.add(table);
            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }

    private void addHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell(new Phrase(headerTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE)));
        header.setBackgroundColor(AZUL_ESCURO);
        header.setBorderColor(CINZA_LINHA);
        header.setBorderWidth(1);
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setVerticalAlignment(Element.ALIGN_MIDDLE);
        header.setPadding(8);
        table.addCell(header);
    }

    private void addCell(PdfPTable table, String text, Font font, boolean zebra) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderColor(CINZA_LINHA);
        cell.setBorderWidth(1);
        cell.setPadding(8);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBackgroundColor(zebra ? ZEBRA : Color.WHITE);
        table.addCell(cell);
    }

    private PdfPCell celMini(String text, Font font, int border, float padding, Color background) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setBorder(border);
        c.setPadding(padding);
        c.setBackgroundColor(background);
        return c;
    }
}
