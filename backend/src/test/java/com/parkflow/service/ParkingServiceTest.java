package com.parkflow.service;

import com.parkflow.model.Registro;
import com.parkflow.model.StatusRegistro;
import com.parkflow.model.Veiculo;
import com.parkflow.repository.RegistroRepository;
import com.parkflow.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ParkingService Tests")
class ParkingServiceTest {

    @Mock
    private VeiculoRepository veiculoRepository;

    @Mock
    private RegistroRepository registroRepository;

    @InjectMocks
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

    @Nested
    @DisplayName("registrarEntrada")
    class RegistrarEntradaTests {

        @Test
        @DisplayName("Deve criar novo veículo e registro quando veículo não existe")
        void devecriarNovoVeiculoERegistro() {
            // Arrange
            when(veiculoRepository.findByPlaca("NEW-1234")).thenReturn(Optional.empty());
            when(veiculoRepository.save(any(Veiculo.class))).thenAnswer(invocation -> {
                Veiculo v = invocation.getArgument(0);
                v.setId(2L);
                return v;
            });
            when(registroRepository.save(any(Registro.class))).thenAnswer(invocation -> {
                Registro r = invocation.getArgument(0);
                r.setId(2L);
                return r;
            });

            // Act
            Registro resultado = parkingService.registrarEntrada("NEW-1234", "Honda Civic", "Preto", "CARRO");

            // Assert
            assertNotNull(resultado);
            assertEquals(StatusRegistro.ABERTO, resultado.getStatus());
            assertNotNull(resultado.getDataEntrada());
            verify(veiculoRepository).findByPlaca("NEW-1234");
            verify(veiculoRepository).save(any(Veiculo.class));
            verify(registroRepository).save(any(Registro.class));
        }

        @Test
        @DisplayName("Deve usar veículo existente quando já cadastrado")
        void deveUsarVeiculoExistente() {
            // Arrange
            when(veiculoRepository.findByPlaca("ABC-1234")).thenReturn(Optional.of(veiculo));
            when(registroRepository.save(any(Registro.class))).thenAnswer(invocation -> {
                Registro r = invocation.getArgument(0);
                r.setId(2L);
                return r;
            });

            // Act
            Registro resultado = parkingService.registrarEntrada("ABC-1234", "Toyota Corolla", "Prata", "CARRO");

            // Assert
            assertNotNull(resultado);
            assertEquals(veiculo, resultado.getVeiculo());
            verify(veiculoRepository).findByPlaca("ABC-1234");
            verify(veiculoRepository, never()).save(any(Veiculo.class));
            verify(registroRepository).save(any(Registro.class));
        }

        @Test
        @DisplayName("Deve atualizar dados do veículo quando diferentes")
        void deveAtualizarDadosDoVeiculo() {
            // Arrange
            when(veiculoRepository.findByPlaca("ABC-1234")).thenReturn(Optional.of(veiculo));
            when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculo);
            when(registroRepository.save(any(Registro.class))).thenAnswer(invocation -> {
                Registro r = invocation.getArgument(0);
                r.setId(2L);
                return r;
            });

            // Act
            Registro resultado = parkingService.registrarEntrada("ABC-1234", "Toyota Camry", "Azul", "CARRO");

            // Assert
            assertNotNull(resultado);
            verify(veiculoRepository).save(veiculo);
            assertEquals("Toyota Camry", veiculo.getModelo());
            assertEquals("Azul", veiculo.getCor());
        }
    }

    @Nested
    @DisplayName("calcularSaida")
    class CalcularSaidaTests {

        @Test
        @DisplayName("Deve lançar exceção quando registro não encontrado")
        void deveLancarExcecaoQuandoRegistroNaoEncontrado() {
            // Arrange
            when(registroRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> parkingService.calcularSaida(999L));
            assertEquals("Registro não encontrado", exception.getMessage());
        }

        @Test
        @DisplayName("Deve lançar exceção quando registro já pago")
        void deveLancarExcecaoQuandoRegistroJaPago() {
            // Arrange
            registro.setStatus(StatusRegistro.PAGO);
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> parkingService.calcularSaida(1L));
            assertEquals("Registro já pago", exception.getMessage());
        }

        @Test
        @DisplayName("Deve calcular R$10 para permanência menor que 1 hora")
        void deveCalcular10ReaisParaMenosDeUmaHora() {
            // Arrange
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(30));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act
            Registro resultado = parkingService.calcularSaida(1L);

            // Assert
            assertEquals(10.0, resultado.getValorTotal());
            assertNotNull(resultado.getDataSaida());
        }

        @Test
        @DisplayName("Deve calcular R$10 para exatamente 1 hora")
        void deveCalcular10ReaisParaExatamenteUmaHora() {
            // Arrange
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(60));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act
            Registro resultado = parkingService.calcularSaida(1L);

            // Assert
            assertEquals(10.0, resultado.getValorTotal());
        }

        @Test
        @DisplayName("Deve calcular R$15 para 2 horas (R$10 + R$5)")
        void deveCalcular15ReaisParaDuasHoras() {
            // Arrange
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(120));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act
            Registro resultado = parkingService.calcularSaida(1L);

            // Assert
            assertEquals(15.0, resultado.getValorTotal());
        }

        @Test
        @DisplayName("Deve calcular R$30 para 5 horas (R$10 + 4*R$5)")
        void deveCalcular30ReaisParaCincoHoras() {
            // Arrange
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(300));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act
            Registro resultado = parkingService.calcularSaida(1L);

            // Assert
            assertEquals(30.0, resultado.getValorTotal());
        }

        @Test
        @DisplayName("Deve arredondar para cima fração de hora")
        void deveArredondarParaCimaFracaoDeHora() {
            // Arrange - 1 hora e 20 minutos = 2 horas arredondadas
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(80));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));

            // Act
            Registro resultado = parkingService.calcularSaida(1L);

            // Assert
            assertEquals(15.0, resultado.getValorTotal()); // R$10 + R$5 = R$15
        }
    }

    @Nested
    @DisplayName("confirmarPagamento")
    class ConfirmarPagamentoTests {

        @Test
        @DisplayName("Deve salvar registro com status PAGO")
        void deveSalvarComStatusPago() {
            // Arrange
            registro.setDataEntrada(LocalDateTime.now().minusMinutes(60));
            when(registroRepository.findById(1L)).thenReturn(Optional.of(registro));
            when(registroRepository.save(any(Registro.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            Registro resultado = parkingService.confirmarPagamento(1L);

            // Assert
            assertEquals(StatusRegistro.PAGO, resultado.getStatus());
            assertNotNull(resultado.getValorTotal());
            verify(registroRepository).save(registro);
        }
    }

    @Nested
    @DisplayName("listarVeiculosEstacionados")
    class ListarVeiculosEstacionadosTests {

        @Test
        @DisplayName("Deve retornar lista de registros abertos")
        void deveRetornarRegistrosAbertos() {
            // Arrange
            List<Registro> registrosAbertos = Arrays.asList(registro, new Registro());
            when(registroRepository.findByStatus(StatusRegistro.ABERTO)).thenReturn(registrosAbertos);

            // Act
            List<Registro> resultado = parkingService.listarVeiculosEstacionados();

            // Assert
            assertEquals(2, resultado.size());
            verify(registroRepository).findByStatus(StatusRegistro.ABERTO);
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando não há registros abertos")
        void deveRetornarListaVazia() {
            // Arrange
            when(registroRepository.findByStatus(StatusRegistro.ABERTO)).thenReturn(Collections.emptyList());

            // Act
            List<Registro> resultado = parkingService.listarVeiculosEstacionados();

            // Assert
            assertTrue(resultado.isEmpty());
        }
    }

    @Nested
    @DisplayName("contarVagasOcupadas")
    class ContarVagasOcupadasTests {

        @Test
        @DisplayName("Deve retornar quantidade correta de vagas ocupadas")
        void deveRetornarQuantidadeCorreta() {
            // Arrange
            List<Registro> registrosAbertos = Arrays.asList(registro, new Registro(), new Registro());
            when(registroRepository.findByStatus(StatusRegistro.ABERTO)).thenReturn(registrosAbertos);

            // Act
            long resultado = parkingService.contarVagasOcupadas();

            // Assert
            assertEquals(3, resultado);
        }

        @Test
        @DisplayName("Deve retornar zero quando não há vagas ocupadas")
        void deveRetornarZero() {
            // Arrange
            when(registroRepository.findByStatus(StatusRegistro.ABERTO)).thenReturn(Collections.emptyList());

            // Act
            long resultado = parkingService.contarVagasOcupadas();

            // Assert
            assertEquals(0, resultado);
        }
    }

    @Nested
    @DisplayName("buscarFaturamentoPorPeriodo")
    class BuscarFaturamentoPorPeriodoTests {

        @Test
        @DisplayName("Deve chamar repositório com parâmetros corretos")
        void deveChamarRepositorioCorretamente() {
            // Arrange
            LocalDateTime inicio = LocalDateTime.of(2025, 12, 1, 0, 0);
            LocalDateTime fim = LocalDateTime.of(2025, 12, 31, 23, 59);
            List<Registro> registrosPagos = Arrays.asList(registro);
            when(registroRepository.findByStatusAndDataSaidaBetween(StatusRegistro.PAGO, inicio, fim))
                    .thenReturn(registrosPagos);

            // Act
            List<Registro> resultado = parkingService.buscarFaturamentoPorPeriodo(inicio, fim);

            // Assert
            assertEquals(1, resultado.size());
            verify(registroRepository).findByStatusAndDataSaidaBetween(StatusRegistro.PAGO, inicio, fim);
        }
    }

    @Nested
    @DisplayName("calcularTotalFaturamento")
    class CalcularTotalFaturamentoTests {

        @Test
        @DisplayName("Deve somar valores corretamente")
        void deveSomarValores() {
            // Arrange
            Registro r1 = new Registro();
            r1.setValorTotal(10.0);
            Registro r2 = new Registro();
            r2.setValorTotal(15.0);
            Registro r3 = new Registro();
            r3.setValorTotal(25.0);
            List<Registro> registros = Arrays.asList(r1, r2, r3);

            // Act
            Double resultado = parkingService.calcularTotalFaturamento(registros);

            // Assert
            assertEquals(50.0, resultado);
        }

        @Test
        @DisplayName("Deve retornar zero para lista vazia")
        void deveRetornarZeroParaListaVazia() {
            // Act
            Double resultado = parkingService.calcularTotalFaturamento(Collections.emptyList());

            // Assert
            assertEquals(0.0, resultado);
        }

        @Test
        @DisplayName("Deve tratar valores nulos como zero")
        void deveTratarValoresNulosComoZero() {
            // Arrange
            Registro r1 = new Registro();
            r1.setValorTotal(10.0);
            Registro r2 = new Registro();
            r2.setValorTotal(null);
            List<Registro> registros = Arrays.asList(r1, r2);

            // Act
            Double resultado = parkingService.calcularTotalFaturamento(registros);

            // Assert
            assertEquals(10.0, resultado);
        }
    }
}
