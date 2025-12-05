package com.parkflow.repository;

import com.parkflow.model.Registro;
import com.parkflow.model.StatusRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByStatus(StatusRegistro status);

    List<Registro> findByStatusAndDataSaidaBetween(StatusRegistro status, LocalDateTime inicio, LocalDateTime fim);
}
