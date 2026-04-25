package agenda.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import agenda.model.TipoEvento;
import agenda.repository.TipoEventoRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos")
@RequiredArgsConstructor
public class TipoEventoController {

    private final TipoEventoRepository tipoEventoRepository;

    @GetMapping
    public ResponseEntity<List<TipoEvento>> listarTodos() {
        return ResponseEntity.ok(tipoEventoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<TipoEvento> crearTipo(@RequestBody TipoEvento tipoEvento) {
        TipoEvento creado = tipoEventoRepository.save(tipoEvento);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}