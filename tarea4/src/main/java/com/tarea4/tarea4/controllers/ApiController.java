package com.tarea4.tarea4.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class ApiController{

    @GetMapping("/api/buscar_actividad")
    public List<Actividad> buscarActividad(@RequestParam("nombre") String nombre) {
        // Lógica para buscar actividades por nombre
        return null; // Vacio para no bugs x el momento
    }    
}
