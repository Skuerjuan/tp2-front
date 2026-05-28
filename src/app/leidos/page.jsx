"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../styles.css";
import { resenas as initialResenas } from "../page.jsx";

export default function LibrosLeidosPage() {
  const [resenas, setResenas] = useState(() => {
    try {
      const raw = localStorage.getItem("resenas");
      return raw ? JSON.parse(raw) : initialResenas;
    } catch {
      return initialResenas;
    }
  });

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPuntaje, setFiltroPuntaje] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editAutor, setEditAutor] = useState("");
  const [editGenero, setEditGenero] = useState("");
  const [editResena, setEditResena] = useState("");

  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  const resultados = useMemo(() => {
    return resenas.filter((r) => {
      const texto = filtroTexto.trim().toLowerCase();
      const matchTexto =
        !texto ||
        r.titulo.toLowerCase().includes(texto) ||
        r.autor.toLowerCase().includes(texto);
      const matchGenero = !filtroGenero || r.genero === filtroGenero;
      const matchPuntaje = !filtroPuntaje || r.puntaje >= Number(filtroPuntaje);
      return matchTexto && matchGenero && matchPuntaje;
    });
  }, [resenas, filtroTexto, filtroGenero, filtroPuntaje]);

  function abrirEditar(i) {
    const t = resenas[i];
    setEditIndex(i);
    setEditTitulo(t.titulo);
    setEditAutor(t.autor);
    setEditGenero(t.genero || "");
    setEditResena(t.resena || "");
    setIsModalOpen(true);
  }

  function guardarEdicion(e) {
    e?.preventDefault();
    if (editIndex === null) return;
    setResenas((prev) => {
      const copy = [...prev];
      copy[editIndex] = {
        ...copy[editIndex],
        titulo: editTitulo.trim(),
        autor: editAutor.trim(),
        genero: editGenero,
        resena: editResena.trim(),
      };
      return copy;
    });
    cerrarModal();
  }

  function cerrarModal() {
    setIsModalOpen(false);
    setEditIndex(null);
    setEditTitulo("");
    setEditAutor("");
    setEditGenero("");
    setEditResena("");
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
        <h1 id="titulo">Libros leídos</h1>
        <p id="subtitulo">Todos los libros que ya pasaron por tus manos.</p>
      </header>

      <nav id="nav">
        <Link href="/">Home</Link>
        <Link href="/libros-leidos" className="active">
          Libros leídos
        </Link>
        <Link href="/resenas">Reseñas</Link>
        <Link href="/buscar">Buscar</Link>
      </nav>

      <div className="filtros-bar">
        <input
          type="text"
          id="filtroTexto"
          placeholder="Filtrar por título o autor…"
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />
        <select
          id="filtroGenero"
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
        >
          <option value="">Todos los géneros</option>
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

        <select
          id="filtroPuntaje"
          value={filtroPuntaje}
          onChange={(e) => setFiltroPuntaje(e.target.value)}
        >
          <option value="">Cualquier puntaje</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆ o más</option>
          <option value="3">★★★☆☆ o más</option>
        </select>
      </div>

      <div id="contenido" className="grid-libros">
        {resultados.length === 0 ? (
          <p className="sin-resultados">No se encontraron libros con esos filtros.</p>
        ) : (
          resultados.map((libro, i) => {
            const idx = resenas.indexOf(libro);
            return (
              <article
                className="tarjeta"
                key={`${libro.titulo}-${idx}`}
                style={{ animationDelay: `${idx * 0.06}s` }}
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
                      onClick={() => cambiarPuntaje(idx, n)}
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

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => abrirEditar(idx)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setResenas((prev) => prev.filter((_, j) => j !== idx))
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="modal-cerrar"
              aria-label="Cerrar"
              onClick={cerrarModal}
            >
              ✕
            </button>
            <h2>Editar reseña</h2>
            <form className="formulario-box" onSubmit={guardarEdicion}>
              <input
                type="text"
                id="editTitulo"
                placeholder="Título"
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
              />
              <input
                type="text"
                id="editAutor"
                placeholder="Autor"
                value={editAutor}
                onChange={(e) => setEditAutor(e.target.value)}
              />
              <select
                id="editGenero"
                className="full-col"
                value={editGenero}
                onChange={(e) => setEditGenero(e.target.value)}
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

              <textarea
                id="editResena"
                placeholder="Tu reseña…"
                value={editResena}
                onChange={(e) => setEditResena(e.target.value)}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit">Guardar cambios</button>
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}