package com.parkflow.service;

import com.parkflow.model.Registro;
import com.parkflow.model.StatusRegistro;
import com.parkflow.model.Veiculo;
import com.parkflow.repository.RegistroRepository;
import com.parkflow.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParkingService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private RegistroRepository registroRepository;

    public Registro registrarEntrada(String placa, String modelo, String cor, String tipo) {
        Veiculo veiculo = veiculoRepository.findByPlaca(placa)
                .orElseGet(() -> {
                    Veiculo novo = new Veiculo();
                    novo.setPlaca(placa);
                    novo.setModelo(modelo);
                    novo.setCor(cor);
                    novo.setTipo(tipo);
                    return veiculoRepository.save(novo);
                });

        // Update existing vehicle info if different
        if (!modelo.equals(veiculo.getModelo()) ||
                (cor != null && !cor.equals(veiculo.getCor())) ||
                (tipo != null && !tipo.equals(veiculo.getTipo()))) {
            veiculo.setModelo(modelo);
            veiculo.setCor(cor);
            veiculo.setTipo(tipo);
            veiculoRepository.save(veiculo);
        }

        Registro registro = new Registro();
        registro.setVeiculo(veiculo);
        registro.setDataEntrada(LocalDateTime.now());
        registro.setStatus(StatusRegistro.ABERTO);

        return registroRepository.save(registro);
    }

    public Registro calcularSaida(Long registroId) {
        Registro registro = registroRepository.findById(registroId)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        if (registro.getStatus() == StatusRegistro.PAGO) {
            throw new RuntimeException("Registro já pago");
        }

        LocalDateTime saida = LocalDateTime.now();
        registro.setDataSaida(saida);

        long minutos = Duration.between(registro.getDataEntrada(), saida).toMinutes();
        double horas = Math.ceil(minutos / 60.0);

        double valor = 10.0; // Primeira hora
        if (horas > 1) {
            valor += (horas - 1) * 5.0;
        }

        registro.setValorTotal(valor);
        return registro;
    }

    public Registro confirmarPagamento(Long registroId) {
        Registro registro = calcularSaida(registroId);
        registro.setStatus(StatusRegistro.PAGO);
        return registroRepository.save(registro);
    }

    public List<Registro> listarVeiculosEstacionados() {
        return registroRepository.findByStatus(StatusRegistro.ABERTO);
    }

    public long contarVagasOcupadas() {
        return registroRepository.findByStatus(StatusRegistro.ABERTO).size();
    }

    public List<Registro> buscarFaturamentoPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return registroRepository.findByStatusAndDataSaidaBetween(StatusRegistro.PAGO, inicio, fim);
    }

    public Double calcularTotalFaturamento(List<Registro> registros) {
        return registros.stream()
                .mapToDouble(r -> r.getValorTotal() != null ? r.getValorTotal() : 0.0)
                .sum();
    }
}
