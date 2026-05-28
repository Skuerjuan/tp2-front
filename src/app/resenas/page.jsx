"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../styles.css";
import { resenas as initialResenas } from "../page.jsx";

export default function ResenasPage() {
  const [resenas, setResenas] = useState(() => {
    try {
      const raw = localStorage.getItem("resenas");
      return raw ? JSON.parse(raw) : initialResenas;
    } catch {
      return initialResenas;
    }
  });

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [puntajeTemp, setPuntajeTemp] = useState(0);
  const [resenaText, setResenaText] = useState("");

  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  function agregarLibro(e) {
    e?.preventDefault();
    if (!titulo.trim() || !autor.trim()) return;

    const nuevo = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero,
      puntaje: puntajeTemp || 0,
      resena: resenaText.trim(),
    };

    setResenas((prev) => [nuevo, ...prev]);
    setTitulo("");
    setAutor("");
    setGenero("");
    setPuntajeTemp(0);
    setResenaText("");
  }

  function cambiarPuntaje(index, valor) {
    setResenas((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], puntaje: Number(valor) };
      return copy;
    });
  }

  return (
    <main>
      <header id="header">
        <h1 id="titulo">Reseñas</h1>
        <p id="subtitulo">Agregá un libro nuevo y dejá tu impresión.</p>
      </header>

      <nav id="nav">
        <Link href="/">Home</Link>
        <Link href="/leidos">Libros leídos</Link>
        <Link href="/resenas" className="active">
          Reseñas
        </Link>
        <Link href="/buscar">Buscar</Link>
      </nav>

      <section className="formulario-box" id="formulario">
        <h2>Agregar un libro</h2>
        <form onSubmit={agregarLibro} className="form-grid">
          <input
            type="text"
            id="tituloInput"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <input
            type="text"
            id="autorInput"
            placeholder="Autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <select
            id="generoInput"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="">Seleccionar género…</option>
            <option value="novela">Novela</option>
            <option value="cuento">Cuento</option>
            <option value="ensayo">Ensayo</option>
            <option value="poesia">Poesía</option>
            <option value="ciencia ficcion">Ciencia ficción</option>
            <option value="fantasia">Fantasía</option>
            <option value="terror">Terror</option>
            <option value="historica">Histórica</option>
            <option value="biografía">Biografía</option>
            <option value="otro">Otro</option>
          </select>

          <div
            className="full-col"
            style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}
          >
            <label
              style={{
                fontSize: ".85rem",
                color: "var(--brown)",
                fontStyle: "italic",
              }}
            >
              Puntaje
            </label>

            <div
              id="puntajeInput"
              style={{ display: "flex", gap: 6, justifyContent: "flex-start" }}
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="estrella-btn"
                  aria-label={`Puntaje ${v}`}
                  onClick={() => setPuntajeTemp(v)}
                  style={{
                    fontSize: 20,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {v <= puntajeTemp ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="resenaInput"
            placeholder="Escribe tu reseña…"
            value={resenaText}
            onChange={(e) => setResenaText(e.target.value)}
            className="full-col"
          />

          <div className="full-col" style={{ display: "flex", gap: 8 }}>
            <button type="submit">Agregar libro</button>
            <button
              type="button"
              onClick={() => {
                setTitulo("");
                setAutor("");
                setGenero("");
                setPuntajeTemp(0);
                setResenaText("");
              }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <h2 className="section-title">✦ Últimas reseñas agregadas</h2>

      <div id="contenido" className="grid-libros">
        {resenas.length === 0 ? (
          <p className="sin-resultados">No hay reseñas aún.</p>
        ) : (
          resenas.map((libro, i) => (
            <article
              className="tarjeta"
              key={`${libro.titulo}-${i}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <h3>{libro.titulo}</h3>
              <p>
                <strong>Autor:</strong> {libro.autor}
              </p>
              <p>
                <em>{libro.genero}</em>
              </p>

              <div className="puntaje">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => cambiarPuntaje(i, n)}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      background: "transparent",
                      border: "none",
                    }}
                    aria-label={`Puntaje ${n}`}
                  >
                    {n <= libro.puntaje ? "★" : "☆"}
                  </button>
                ))}
              </div>

              <p>{libro.resena}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}