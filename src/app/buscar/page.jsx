"use client";

import { useEffect, useMemo, useState } from "react";
import "../styles.css";
import Navbar from "@/components/Navbar";
import { fetchResenas, updateResena } from "@/utils/resenas.js";
import { createClient } from "@/utils/supabase/client.js";

export default function BuscarPage() {
const [query, setQuery] = useState("");
const [genero, setGenero] = useState("");
const [minPuntaje, setMinPuntaje] = useState("");
const [resenas, setResenas] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    let mounted = true;

    async function loadResenas() {

        const supabase = await createClient();

        const { data } = await supabase.auth.getSession()
        
        if(!data.session){
            router.push("/auth/sign-in")
            return;
        }
        
        try {
            setLoading(true);
            setError("");
            const data = await fetchResenas();
            if (mounted) {
                setResenas(data);
            }
        } catch (err) {
            if (mounted) {
                setError(err?.message || "No se pudieron cargar los libros.");
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
        const matchQuery =
            !query ||
            r.titulo.toLowerCase().includes(query.toLowerCase()) ||
            r.autor.toLowerCase().includes(query.toLowerCase()) ||
            r.resena.toLowerCase().includes(query.toLowerCase());
        const matchGenero = !genero || (r.genero || "").toLowerCase() === genero;
        const matchPuntaje = !minPuntaje || r.puntaje >= Number(minPuntaje);
        return matchQuery && matchGenero && matchPuntaje;
    });
}, [resenas, query, genero, minPuntaje]);

async function cambiarPuntaje(id, valor) {
    try {
        const updated = await updateResena(id, { puntaje: Number(valor) });
        setResenas((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
        setError(err?.message || "No se pudo actualizar el puntaje.");
    }
}

return (
    <main>
        <header id="header">
        <h1 id="titulo">Buscar</h1>
        <p id="subtitulo">Encontrá libros en tu biblioteca personal.</p>
        </header>

        <Navbar active="buscar" />

        {loading && <p className="sin-resultados">Cargando libros...</p>}
        {!loading && error && <p className="sin-resultados">{error}</p>}

        <section className="p-4 m-2 flex flex-col items-start gap-4">
            <p className="text-lg font-semibold m-2">¿Qué libro estás buscando?</p>

            <div className="flex gap-2 w-full max-w-md">
                <input
                    id="buscarInput"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Título, autor o palabra clave…"
                    autoComplete="off"
                    className="flex-grow border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div className="filtro-genero-buscar">
                <select id="buscarGenero" value={genero} onChange={(e) => setGenero(e.target.value)}>
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

                <select id="buscarPuntaje" value={minPuntaje} onChange={(e) => setMinPuntaje(e.target.value)}>
                    <option value="">Cualquier puntaje</option>
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆ o más</option>
                    <option value="3">★★★☆☆ o más</option>
                </select>
            </div>
        </section>

        <p id="contadorResultados">
            {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}
        </p>

        <div id="contenido" className="grid-libros">
            {!loading && !error && resultados.length === 0 ? (
            <p className="sin-resultados">No se encontraron resultados para tu búsqueda.</p>
            ) : (
            resultados.map((libro, i) => (
                <article className="tarjeta" key={libro.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <h3>{libro.titulo}</h3>
                <p><strong>Autor:</strong> {libro.autor}</p>

                <div className="puntaje">
                    {[1, 2, 3, 4, 5].map((n) => (
                    <span
                        key={n}
                        onClick={() => cambiarPuntaje(libro.id, n)}
                        style={{ cursor: "pointer", fontSize: "24px" }}
                        role="button"
                        aria-label={`Puntaje ${n}`}
                    >
                        {n <= libro.puntaje ? "★" : "☆"}
                    </span>
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