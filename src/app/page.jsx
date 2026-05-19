"use client";

import { useState } from "react";
import "./styles.css";

export default function Home() {
  const [resenas, setResenas] = useState([
    {
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      puntaje: 5,
      resena: "Una obra maestra del realismo mágico.",
    },
    {
      titulo: "El túnel",
      autor: "Ernesto Sábato",
      puntaje: 4,
      resena: "Intensa y oscura, no la podés soltar.",
    },
    {
      titulo: "Ficciones",
      autor: "Jorge Luis Borges",
      puntaje: 5,
      resena: "Cada cuento es un universo propio.",
    },
  ]);

  const cambiarPuntaje = (index, nuevoPuntaje) => {
    const nuevasResenas = [...resenas];

    nuevasResenas[index].puntaje = nuevoPuntaje;

    setResenas(nuevasResenas);
  };

  return (
    <>
      <div>
        <div id="header">
          <h1 id="titulo">Página de reseñas</h1>

          <p id="subtitulo">
            Deja reseñas a los libros que leíste y lleva un registro.
          </p>
        </div>

        <div id="nav">
          <div id="logo"></div>

          <p>Home</p>
          <p>Libros leídos</p>
          <p>Reseñas</p>
          <p>Buscar</p>
        </div>

        <div id="contenido">
          {resenas.map((libro, index) => (
            <div className="tarjeta" key={index}>
              <h3>{libro.titulo}</h3>

              <p>
                <strong>Autor:</strong> {libro.autor}
              </p>

              <div className="puntaje">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    onClick={() => cambiarPuntaje(index, num)}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    {num <= libro.puntaje ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <p>{libro.resena}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}