"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import "../styles.css";
import { deleteResena, fetchLeidos, updateResena } from "@/utils/resenas.js";

export default function LibrosLeidosPage() {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPuntaje, setFiltroPuntaje] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editAutor, setEditAutor] = useState("");
  const [editGenero, setEditGenero] = useState("");
  const [editResena, setEditResena] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadResenas() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchLeidos();
        if (mounted) {
          setResenas(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "No se pudieron cargar las reseñas.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadResenas();

    return () => {
      mounted = false;
    };
  }, []);

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

  function abrirEditar(id) {
    const t = resenas.find((item) => item.id === id);
    if (!t) return;
    setEditId(id);
    setEditTitulo(t.titulo);
    setEditAutor(t.autor);
    setEditGenero(t.genero || "");
    setEditResena(t.resena || "");
    setIsModalOpen(true);
  }

  async function guardarEdicion(e) {
    e?.preventDefault();
    if (editId === null) return;

    try {
      const updated = await updateResena(editId, {
        titulo: editTitulo.trim(),
        autor: editAutor.trim(),
        genero: editGenero,
        resena: editResena.trim(),
      });

      setResenas((prev) => prev.map((item) => (item.id === editId ? updated : item)));
      cerrarModal();
    } catch (err) {
      setError(err?.message || "No se pudo guardar la edición.");
    }
  }

  function cerrarModal() {
    setIsModalOpen(false);
    setEditId(null);
    setEditTitulo("");
    setEditAutor("");
    setEditGenero("");
    setEditResena("");
  }

  async function cambiarPuntaje(id, valor) {
    try {
      const updated = await updateResena(id, { puntaje: Number(valor) });
      setResenas((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el puntaje.");
    }
  }

  async function eliminarResena(id) {
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err?.message || "No se pudo eliminar la reseña.");
    }
  }

  return (
    <main>
      <header id="header">
        <h1 id="titulo">Libros leídos</h1>
        <p id="subtitulo">Todos los libros que ya pasaron por tus manos.</p>
      </header>

      <Navbar active="leidos" />

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

      {loading && <p className="sin-resultados">Cargando reseñas...</p>}
      {!loading && error && <p className="sin-resultados">{error}</p>}

      <div id="contenido" className="grid-libros">
        {!loading && !error && resultados.length === 0 ? (
          <p className="sin-resultados">No se encontraron libros con esos filtros.</p>
        ) : (
          resultados.map((libro, i) => {
            return (
              <BookCard
                key={libro.id}
                book={libro}
                animationDelay={`${i * 0.06}s`}
                onRate={cambiarPuntaje}
                onEdit={abrirEditar}
                onDelete={eliminarResena}
              />
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