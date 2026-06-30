package com.tarea4.tarea4.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import com.tarea4.tarea4.models.Actividad;

@Service
public class ActividadService {

    @Autowired
    private JdbcTemplate jdbcTemplate; // Esta herramienta se encarga de hablar con la DB 🗄️

    public List<Actividad> buscarActividades(String texto) {
        // Aquí adentro estructuraremos la consulta para la base de datos
        return null; 
    }
}