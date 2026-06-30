package com.tarea4.tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Le dice a Spring que este archivo maneja páginas HTML
public class AppController {

    // ... Aquí seguro tienes tus otras rutas (ej: @GetMapping("/"), @GetMapping("/registro"), etc.) ...

    // Agregamos la ruta del buscador tal cual lo necesitas:
    @GetMapping("/buscador")
    public String mostrarPaginaBuscador() {
        return "buscador"; // Spring buscará el archivo 'buscador.html' en src/main/resources/templates/
    }
}