package agenda.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import agenda.model.TipoEvento;
import agenda.repository.TipoEventoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TipoEventoService {

    private final TipoEventoRepository tipoEventoRepository;

    @Transactional
    public TipoEvento crearTipo(TipoEvento tipoEvento) {
        return tipoEventoRepository.save(tipoEvento);
    }

    @Transactional(readOnly = true)
    public List<TipoEvento> obtenerTodos() {
        return tipoEventoRepository.findAll();
    }
}