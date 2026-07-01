package com.tarea4.tarea4.services;

import org.springframework.stereotype.Service;
import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.models.ActividadRepository;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ActividadService(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    public List<Actividad> buscarActividades(String patron) {
        List<Actividad> todas = actividadRepository.findAll();
        List<Actividad> filtradas = new ArrayList<>();
        
        String p = patron.toLowerCase();

        for (Actividad act : todas) {
            // Verificar nombre de actividad
            boolean coincideNombre = act.getNombre() != null && act.getNombre().toLowerCase().contains(p);
            
            // Verificar descripción
            boolean coincideDesc = act.getDescripcion() != null && act.getDescripcion().toLowerCase().contains(p);
            
            // Verificar nombre de comuna (Navegando: Actividad -> Miembro -> Comuna -> Nombre)
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
    // Método para agregar la nota de forma segura (Parte 2 de tarea 4)
    public Actividad agregarNota(Integer actividadId, Integer valorNota) {
        // Validar que la nota esté entre 1 y 7
        if (valorNota < 1 || valorNota > 7) {
            throw new IllegalArgumentException("La nota debe ser un número entero entre 1 y 7.");
        }

        // Buscar actividad
        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        // Crear y guardar la nueva nota
        Nota nuevaNota = new Nota(valorNota, actividad);
        notaRepository.save(nuevaNota);
        actividad.getNotas().add(nuevaNota);

        return actividad;
    }

}