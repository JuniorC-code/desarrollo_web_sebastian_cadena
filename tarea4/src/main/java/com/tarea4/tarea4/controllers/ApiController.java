package com.tarea4.tarea4.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.services.ActividadService;

import java.util.List;
import java.util.Map;

@RestController
public class ApiController {

    private final ActividadService actividadService;

    // Inyección por constructor (tal cual como en tu auxiliar)
    public ApiController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }
    
    // Ruta que recibirá el texto de búsqueda desde JavaScript
    @GetMapping("/api/buscar/{patron}")
    public Map<String, List<Actividad>> buscarActividadesEndpoint(@PathVariable("patron") String patron) {
        List<Actividad> actividades = actividadService.buscarActividades(patron);
        return Map.of("data", actividades); // Estructura idéntica al auxiliar
    }
}