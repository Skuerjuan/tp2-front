"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import "../styles.css";
import { deleteResena, fetchLeidosConResenas, updateLeidoPuntaje, updateResena } from "@/utils/resenas.js";
import { createClient } from "@/utils/supabase/client.js";


export default function LibrosLeidosPage() {
  const router = useRouter();
  const supabase = createClient();

  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editAutor, setEditAutor] = useState("");
  const [editGenero, setEditGenero] = useState("");
  const [editResena, setEditResena] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadResenas() {

      const { data } = await supabase.auth.getSession()
      
      if(!data.session){
        router.push("/auth/sign-in")
        return;
      }


      try {
        setLoading(true);
        setError("");
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        const user = userData?.user;
        if (!user) {
          router.push("/auth/sign-in");
          return;
        }

        if (mounted) {
          setUserId(user.id);
        }

        const data = await fetchLeidosConResenas(user.id);
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
  }, [router, supabase]);

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
    if (!userId) {
      setError("No se pudo identificar la sesión actual.");
      return;
    }

    try {
      const updated = await updateLeidoPuntaje(userId, id, Number(valor));
      setResenas((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, puntaje_leido: updated.puntaje } : item
        )
      );
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

      {loading && <p className="sin-resultados">Cargando reseñas...</p>}
      {!loading && error && <p className="sin-resultados">{error}</p>}

      <div id="contenido" className="grid-libros">
        {!loading && !error && resenas.length === 0 ? (
          <p className="sin-resultados">No se encontraron libros leídos.</p>
        ) : (
          resenas.map((libro, i) => {
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