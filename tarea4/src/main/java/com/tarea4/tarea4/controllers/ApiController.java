package com.tarea4.tarea4.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.services.ActividadService;

import java.util.List;
import java.util.Map;

@RestController
public class ApiController {

    private final ActividadService actividadService;

    public ApiController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }
    
    @GetMapping("/api/buscar/{patron}")
    public Map<String, List<Actividad>> buscarActividadesEndpoint(@PathVariable("patron") String patron) {
        List<Actividad> actividades = actividadService.buscarActividades(patron);
        return Map.of("data", actividades); // Estructura idéntica al auxiliar
    }


    @PostMapping("/api/actividades/evaluar")
    public Map<String, Object> evaluarActividad(@RequestParam("actividadId") Integer actividadId,@RequestParam("nota") Integer nota) {
        try {
            // Ejecuta la lógica del servicio
            Actividad actActualizada = actividadService.agregarNota(actividadId, nota);

            // Respondemos con los nuevos datos recalculados para que JS actualice la interfaz
            return Map.of(
                "success", true,
                "nuevaNotaPromedio", actActualizada.getNotaPromedio(),
                "totalNotas", actActualizada.getNotas().size()
            );
        } catch (Exception e) {
            return Map.of("success", false, "error", e.getMessage());
        }
    }

}