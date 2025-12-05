package com.parkflow.dto;

import com.parkflow.model.Registro;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "Resposta com dados de faturamento por período")
public class FaturamentoResponse {

    @Schema(description = "Lista de registros pagos no período")
    private List<Registro> registros;

    @Schema(description = "Total faturado no período", example = "150.00")
    private Double totalFaturado;

    @Schema(description = "Quantidade de veículos atendidos", example = "10")
    private Integer quantidadeVeiculos;
}
