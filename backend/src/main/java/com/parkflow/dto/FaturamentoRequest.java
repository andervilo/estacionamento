package com.parkflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "Filtro para consulta de faturamento por período")
public class FaturamentoRequest {

    @Schema(description = "Data inicial do período", example = "2025-12-01T00:00:00")
    private LocalDateTime dataInicio;

    @Schema(description = "Data final do período", example = "2025-12-31T23:59:59")
    private LocalDateTime dataFim;
}
