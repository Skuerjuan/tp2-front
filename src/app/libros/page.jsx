"use client";

import { useEffect, useState } from "react";
import "../styles.css";
import { fetchLeidos, fetchResenas, insertLeido, insertResena } from "@/utils/resenas.js";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client.js";
import { useRouter } from "next/navigation";


export default function LibrosPage() {
  const supabase = createClient();
  const router = useRouter();
  const [resenas, setResenas] = useState([]);
  const [leidosIds, setLeidosIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [puntajeTemp, setPuntajeTemp] = useState(0);
  const [resenaText, setResenaText] = useState("");

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
        if (user) {
          setUserId(user.id);
          const leidos = await fetchLeidos(user.id);
          setLeidosIds(leidos.map((item) => item.resena_id).filter(Boolean));
        }

        const data = await fetchResenas();
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

  async function agregarLibro(e) {
    e?.preventDefault();
    if (!titulo.trim() || !autor.trim()) return;

    const nuevo = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero,
      puntaje: puntajeTemp || 0,
      resena: resenaText.trim(),
    };

    try {
      const inserted = await insertResena(nuevo);
      setResenas((prev) => [inserted, ...prev]);
      setTitulo("");
      setAutor("");
      setGenero("");
      setPuntajeTemp(0);
      setResenaText("");
    } catch (err) {
      setError(err?.message || "No se pudo crear la reseña.");
    }
  }

  async function marcarComoLeido(resena) {
    if (!userId) {
      setError("No se pudo identificar la sesión actual.");
      return;
    }

    try {
      await insertLeido(userId, resena.id, resena.puntaje || 0);
      setLeidosIds((prev) => (prev.includes(resena.id) ? prev : [...prev, resena.id]));
    } catch (err) {
      setError(err?.message || "No se pudo marcar como leído.");
    }
  }

  return (
    <main>
      <header id="header">
        <h1 id="titulo">Libros</h1>
        <p id="subtitulo">Agregá un libro nuevo y dejá tu impresión.</p>
      </header>

      <Navbar active="libros" />

      {loading && <p className="sin-resultados">Cargando libros...</p>}
      {!loading && error && <p className="sin-resultados">{error}</p>}

      <section className="formulario-box" id="formulario">
        <h2>Agregar un libro</h2>
        <form onSubmit={agregarLibro} className="flex flex-col gap-4 max-w-md w-full">
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
            <option value="Novela">Novela</option>
            <option value="Cuento">Cuento</option>
            <option value="Ensayo">Ensayo</option>
            <option value="Poesía">Poesía</option>
            <option value="Ciencia ficción">Ciencia ficción</option>
            <option value="Fantasía">Fantasía</option>
            <option value="Terror">Terror</option>
            <option value="Histórica">Histórica</option>
            <option value="Biografía">Biografía</option>
            <option value="Otro">Otro</option>
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

      <h2 className="section-title">✦ Últimos libros agregados</h2>

      <div id="contenido" className="grid-libros">
        {!loading && !error && resenas.length === 0 ? (
          <p className="sin-resultados">No hay libros aún.</p>
        ) : (
          resenas.map((libro, i) => (
            <article
              className="tarjeta"
              key={libro.id}
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
                  <span
                    key={n}
                    style={{
                      fontSize: "24px",
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    {n <= libro.puntaje ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <p>{libro.resena}</p>

              <div className="full-col" style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => marcarComoLeido(libro)}
                  disabled={leidosIds.includes(libro.id)}
                  className="px-4 py-2 m-4 w-44 rounded-md border border-[color:var(--brown)] text-[color:var(--brown)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {leidosIds.includes(libro.id) ? "Ya leído" : "Marcar como leído"}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}