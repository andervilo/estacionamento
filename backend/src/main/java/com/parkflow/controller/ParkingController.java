package com.parkflow.controller;

import com.parkflow.dto.DashboardResponse;
import com.parkflow.dto.EntradaRequest;
import com.parkflow.dto.FaturamentoResponse;
import com.parkflow.model.Registro;
import com.parkflow.service.ParkingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "ParkFlow API", description = "API para controle de estacionamento")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @Operation(summary = "Obter dados do dashboard", description = "Retorna o número de vagas ocupadas e disponíveis")
    @ApiResponse(responseCode = "200", description = "Dados do dashboard retornados com sucesso")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        long ocupadas = parkingService.contarVagasOcupadas();
        long total = 50;
        DashboardResponse response = new DashboardResponse();
        response.setOcupadas(ocupadas);
        response.setDisponiveis(total - ocupadas);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Registrar entrada de veículo", description = "Registra a entrada de um veículo no estacionamento")
    @ApiResponse(responseCode = "200", description = "Entrada registrada com sucesso")
    @PostMapping("/entrada")
    public ResponseEntity<Registro> registrarEntrada(@RequestBody EntradaRequest request) {
        return ResponseEntity.ok(parkingService.registrarEntrada(
                request.getPlaca(),
                request.getModelo(),
                request.getCor(),
                request.getTipo()));
    }

    @Operation(summary = "Listar veículos estacionados", description = "Retorna todos os registros com status ABERTO")
    @ApiResponse(responseCode = "200", description = "Lista de veículos estacionados")
    @GetMapping("/registros/abertos")
    public ResponseEntity<List<Registro>> listarAbertos() {
        return ResponseEntity.ok(parkingService.listarVeiculosEstacionados());
    }

    @Operation(summary = "Calcular valor da saída", description = "Calcula o valor a ser pago com base no tempo de permanência. R$ 10,00 na primeira hora e R$ 5,00 por hora adicional.")
    @ApiResponse(responseCode = "200", description = "Cálculo realizado com sucesso")
    @PostMapping("/saida/{id}/calculo")
    public ResponseEntity<Registro> calcularSaida(
            @Parameter(description = "ID do registro") @PathVariable Long id) {
        return ResponseEntity.ok(parkingService.calcularSaida(id));
    }

    @Operation(summary = "Confirmar pagamento e saída", description = "Confirma o pagamento e registra a saída do veículo")
    @ApiResponse(responseCode = "200", description = "Pagamento confirmado com sucesso")
    @PostMapping("/saida/{id}/confirmar")
    public ResponseEntity<Registro> confirmarPagamento(
            @Parameter(description = "ID do registro") @PathVariable Long id) {
        return ResponseEntity.ok(parkingService.confirmarPagamento(id));
    }

    @Operation(summary = "Consultar faturamento por período", description = "Retorna todos os registros pagos no período especificado com o total faturado")
    @ApiResponse(responseCode = "200", description = "Faturamento retornado com sucesso")
    @GetMapping("/faturamento")
    public ResponseEntity<FaturamentoResponse> getFaturamento(
            @Parameter(description = "Data inicial (formato: yyyy-MM-ddTHH:mm:ss)", example = "2025-12-01T00:00:00") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @Parameter(description = "Data final (formato: yyyy-MM-ddTHH:mm:ss)", example = "2025-12-31T23:59:59") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {

        List<Registro> registros = parkingService.buscarFaturamentoPorPeriodo(dataInicio, dataFim);
        Double total = parkingService.calcularTotalFaturamento(registros);

        FaturamentoResponse response = new FaturamentoResponse();
        response.setRegistros(registros);
        response.setTotalFaturado(total);
        response.setQuantidadeVeiculos(registros.size());

        return ResponseEntity.ok(response);
    }
}
