package com.tarea4.tarea4.services;

import org.springframework.stereotype.Service;
import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.models.ActividadRepository; 
import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;

    public ActividadService(ActividadRepository actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    public List<Actividad> buscarActividades(String patron) {
        List<Actividad> todas = actividadRepository.findAll();
        List<Actividad> filtradas = new ArrayList<>();
        
        String p = patron.toLowerCase();

        for (Actividad act : todas) {
            // 1. Verificar nombre de actividad
            boolean coincideNombre = act.getNombre() != null && act.getNombre().toLowerCase().contains(p);
            
            // 2. Verificar descripción
            boolean coincideDesc = act.getDescripcion() != null && act.getDescripcion().toLowerCase().contains(p);
            
            // 3. Verificar nombre de comuna (Navegando: Actividad -> Miembro -> Comuna -> Nombre)
            boolean coincideComuna = false;
            if (act.getMiembro() != null && act.getMiembro().getComuna() != null) {
                String nombreComuna = act.getMiembro().getComuna().getNombre();
                coincideComuna = nombreComuna != null && nombreComuna.toLowerCase().contains(p);
            }

            // Si calza con cualquiera de las 3, va a la lista
            if (coincideNombre || coincideDesc || coincideComuna) {
            filtradas.add(act);
        }
    }
    return filtradas;
}
}