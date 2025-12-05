package com.parkflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parkflow.dto.EntradaRequest;
import com.parkflow.model.Registro;
import com.parkflow.model.StatusRegistro;
import com.parkflow.model.Veiculo;
import com.parkflow.service.ParkingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ParkingController.class)
@DisplayName("ParkingController Tests")
class ParkingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ParkingService parkingService;

    private Veiculo veiculo;
    private Registro registro;

    @BeforeEach
    void setUp() {
        veiculo = new Veiculo();
        veiculo.setId(1L);
        veiculo.setPlaca("ABC-1234");
        veiculo.setModelo("Toyota Corolla");
        veiculo.setCor("Prata");
        veiculo.setTipo("CARRO");

        registro = new Registro();
        registro.setId(1L);
        registro.setVeiculo(veiculo);
        registro.setDataEntrada(LocalDateTime.now().minusHours(2));
        registro.setStatus(StatusRegistro.ABERTO);
    }

    @Test
    @DisplayName("GET /api/dashboard - Deve retornar dashboard com vagas ocupadas e disponíveis")
    void getDashboard_DeveRetornarDashboardCorreto() throws Exception {
        // Arrange
        when(parkingService.contarVagasOcupadas()).thenReturn(10L);

        // Act & Assert
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ocupadas", is(10)))
                .andExpect(jsonPath("$.disponiveis", is(40)));
    }

    @Test
    @DisplayName("GET /api/dashboard - Deve retornar todas as vagas disponíveis quando estacionamento vazio")
    void getDashboard_DeveRetornarTodasVagasDisponiveis() throws Exception {
        // Arrange
        when(parkingService.contarVagasOcupadas()).thenReturn(0L);

        // Act & Assert
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ocupadas", is(0)))
                .andExpect(jsonPath("$.disponiveis", is(50)));
    }

    @Test
    @DisplayName("POST /api/entrada - Deve registrar entrada e retornar registro")
    void registrarEntrada_DeveRetornar200ComRegistro() throws Exception {
        // Arrange
        EntradaRequest request = new EntradaRequest();
        request.setPlaca("ABC-1234");
        request.setModelo("Toyota Corolla");
        request.setCor("Prata");
        request.setTipo("CARRO");

        when(parkingService.registrarEntrada("ABC-1234", "Toyota Corolla", "Prata", "CARRO"))
                .thenReturn(registro);

        // Act & Assert
        mockMvc.perform(post("/api/entrada")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.status", is("ABERTO")))
                .andExpect(jsonPath("$.veiculo.placa", is("ABC-1234")));
    }

    @Test
    @DisplayName("GET /api/registros/abertos - Deve retornar lista de registros abertos")
    void listarAbertos_DeveRetornarListaDeRegistros() throws Exception {
        // Arrange
        Registro r2 = new Registro();
        r2.setId(2L);
        r2.setVeiculo(veiculo);
        r2.setDataEntrada(LocalDateTime.now().minusHours(1));
        r2.setStatus(StatusRegistro.ABERTO);

        List<Registro> registros = Arrays.asList(registro, r2);
        when(parkingService.listarVeiculosEstacionados()).thenReturn(registros);

        // Act & Assert
        mockMvc.perform(get("/api/registros/abertos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)));
    }

    @Test
    @DisplayName("GET /api/registros/abertos - Deve retornar lista vazia quando não há veículos")
    void listarAbertos_DeveRetornarListaVazia() throws Exception {
        // Arrange
        when(parkingService.listarVeiculosEstacionados()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/registros/abertos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("POST /api/saida/{id}/calculo - Deve calcular e retornar registro com valor")
    void calcularSaida_DeveRetornarRegistroComValor() throws Exception {
        // Arrange
        registro.setDataSaida(LocalDateTime.now());
        registro.setValorTotal(15.0);
        when(parkingService.calcularSaida(1L)).thenReturn(registro);

        // Act & Assert
        mockMvc.perform(post("/api/saida/1/calculo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.valorTotal", is(15.0)))
                .andExpect(jsonPath("$.dataSaida", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/saida/{id}/confirmar - Deve confirmar pagamento e retornar registro pago")
    void confirmarPagamento_DeveRetornarRegistroPago() throws Exception {
        // Arrange
        registro.setDataSaida(LocalDateTime.now());
        registro.setValorTotal(15.0);
        registro.setStatus(StatusRegistro.PAGO);
        when(parkingService.confirmarPagamento(1L)).thenReturn(registro);

        // Act & Assert
        mockMvc.perform(post("/api/saida/1/confirmar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.status", is("PAGO")))
                .andExpect(jsonPath("$.valorTotal", is(15.0)));
    }

    @Test
    @DisplayName("GET /api/faturamento - Deve retornar faturamento com registros e total")
    void getFaturamento_DeveRetornarFaturamentoResponse() throws Exception {
        // Arrange
        LocalDateTime dataInicio = LocalDateTime.of(2025, 12, 1, 0, 0, 0);
        LocalDateTime dataFim = LocalDateTime.of(2025, 12, 31, 23, 59, 59);

        registro.setDataSaida(LocalDateTime.of(2025, 12, 15, 10, 0));
        registro.setValorTotal(25.0);
        registro.setStatus(StatusRegistro.PAGO);

        List<Registro> registros = Arrays.asList(registro);
        when(parkingService.buscarFaturamentoPorPeriodo(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(registros);
        when(parkingService.calcularTotalFaturamento(registros)).thenReturn(25.0);

        // Act & Assert
        mockMvc.perform(get("/api/faturamento")
                .param("dataInicio", "2025-12-01T00:00:00")
                .param("dataFim", "2025-12-31T23:59:59"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalFaturado", is(25.0)))
                .andExpect(jsonPath("$.quantidadeVeiculos", is(1)))
                .andExpect(jsonPath("$.registros", hasSize(1)));
    }

    @Test
    @DisplayName("GET /api/faturamento - Deve retornar zero quando não há registros no período")
    void getFaturamento_DeveRetornarZeroQuandoSemRegistros() throws Exception {
        // Arrange
        when(parkingService.buscarFaturamentoPorPeriodo(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());
        when(parkingService.calcularTotalFaturamento(Collections.emptyList())).thenReturn(0.0);

        // Act & Assert
        mockMvc.perform(get("/api/faturamento")
                .param("dataInicio", "2025-12-01T00:00:00")
                .param("dataFim", "2025-12-31T23:59:59"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalFaturado", is(0.0)))
                .andExpect(jsonPath("$.quantidadeVeiculos", is(0)))
                .andExpect(jsonPath("$.registros", hasSize(0)));
    }
}
