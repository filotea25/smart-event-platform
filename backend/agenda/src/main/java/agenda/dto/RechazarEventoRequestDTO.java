package agenda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RechazarEventoRequestDTO {

    @NotBlank(message = "El motivo de rechazo es obligatorio")
    @Size(min = 5, message = "El motivo de rechazo debe tener al menos 5 caracteres")
    private String motivo;
}