package agenda.dto;

import java.time.LocalDateTime;

import agenda.enums.EstadoEvento;
import lombok.Data;

@Data
public class CrearEventoRequest {

    private Long tipoId;
    private Long creadorId;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String lugar;
    private String gruposAfectados;
    private String enlaceDocumento;
    private Integer numAsistentes;
    private EstadoEvento estado;
}