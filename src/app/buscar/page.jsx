"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "../styles.css";
import { resenas as initialResenas } from "../page.jsx";

export default function BuscarPage() {
const [query, setQuery] = useState("");
const [genero, setGenero] = useState("");
const [minPuntaje, setMinPuntaje] = useState("");
const [resenas, setResenas] = useState(initialResenas);

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
        <h1 id="titulo">Buscar</h1>
        <p id="subtitulo">Encontrá libros en tu biblioteca personal.</p>
        </header>

        <nav id="nav">
            <Link href="/">Home</Link>
            <Link href="/libros">Libros leídos</Link>
            <Link href="/resenas">Reseñas</Link>
            <Link href="/buscar" className="active">Buscar</Link>
        </nav>

        <section className="buscador-hero">
            <h2>¿Qué libro estás buscando?</h2>

            <div className="buscador-wrap">
                <input
                    id="buscarInput"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Título, autor o palabra clave…"
                    autoComplete="off"
                />
                <button type="button" onClick={() => { /* opcional: foco o submit */ }}>
                    Buscar
                </button>
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
            {resultados.length === 0 ? (
            <p className="sin-resultados">No se encontraron resultados para tu búsqueda.</p>
            ) : (
            resultados.map((libro, i) => (
                <article className="tarjeta" key={`${libro.titulo}-${i}`} style={{ animationDelay: `${i * 0.08}s` }}>
                <h3>{libro.titulo}</h3>
                <p><strong>Autor:</strong> {libro.autor}</p>

                <div className="puntaje">
                    {[1, 2, 3, 4, 5].map((n) => (
                    <span
                        key={n}
                        onClick={() => cambiarPuntaje(resenas.indexOf(libro), n)}
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