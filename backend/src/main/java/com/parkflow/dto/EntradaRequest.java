package com.parkflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Dados para registrar entrada de veículo")
public class EntradaRequest {

    @Schema(description = "Placa do veículo", example = "ABC-1234")
    private String placa;

    @Schema(description = "Modelo do veículo", example = "Toyota Corolla")
    private String modelo;

    @Schema(description = "Cor do veículo", example = "Prata")
    private String cor;

    @Schema(description = "Tipo do veículo", example = "CARRO")
    private String tipo;
}
