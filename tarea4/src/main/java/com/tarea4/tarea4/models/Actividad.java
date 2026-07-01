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
    private String dia; 

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false, length = 45)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

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

    // Método auxiliar para calcular el promedio
    public String getNotaPromedio() {
        if (notas == null || notas.isEmpty()) {
            return "-"; // Si no ha sido evaluada, retorna "-" como enunciado
        }
        double suma = 0;
        for (Nota n : notas) {
            suma += n.getValor();
        }
        double promedio = suma / notas.size();
        return String.format("%.1f", promedio); // promedio con 1 decimal 
    }
}