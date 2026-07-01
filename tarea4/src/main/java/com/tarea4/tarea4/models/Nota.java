package com.tarea4.tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "nota") 
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer valor; // El número entero entre 1 y 7

    @ManyToOne
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    public Nota() {}

    public Nota(Integer valor, Actividad actividad) {
        this.valor = valor;
        this.actividad = actividad;
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }
    public Actividad getActividad() { return actividad; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
}