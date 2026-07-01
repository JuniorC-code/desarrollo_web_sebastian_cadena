package com.tarea4.tarea4.models;

import java.util.List;

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

    // Getters y Setters para las notas
    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
    
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    // Método auxiliar para calcular el promedio (La "nota" que se muestra)
    public String getNotaPromedio() {
        if (notas == null || notas.isEmpty()) {
            return "-"; // Si no ha sido evaluada, retorna "-" como pide el enunciado
        }
        double suma = 0;
        for (Nota n : notas) {
            suma += n.getValor();
        }
        double promedio = suma / notas.size();
        return String.format("%.1f", promedio); // Retorna el promedio con 1 decimal (ej: "5.4")
    }
}