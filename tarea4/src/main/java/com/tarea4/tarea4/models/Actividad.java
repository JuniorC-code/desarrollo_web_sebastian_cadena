package com.tarea4.tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String dia; // Lo manejamos como String para simplificar el Enum de la DB

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false, length = 45)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Enlazamos con Miembro: Muchas actividades pertenecen a un Miembro
    @ManyToOne
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    public Actividad() {}

    // Getters y Setters
    public Integer getId() { return id; }
    public String getDia() { return dia; }
    public String getTipo() { return tipo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Miembro getMiembro() { return miembro; }
    
    // Agrega los setters correspondientes para que Spring pueda mapearlos...
}