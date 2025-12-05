package com.parkflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Dados do dashboard do estacionamento")
public class DashboardResponse {

    @Schema(description = "Número de vagas ocupadas", example = "10")
    private long ocupadas;

    @Schema(description = "Número de vagas disponíveis", example = "40")
    private long disponiveis;
}
