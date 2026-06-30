
import Navbar from "@/components/Navbar";
import "./styles.css";
import { createClient } from "@/utils/supabase/server.js";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: recomendaciones = [] } = await supabase.from("recomendaciones").select("*");

  const { data } = await supabase.auth.getSession();
  if(data.session == null ){
    redirect("/auth/sign-in")
  }

  return (
    <>
      <div id="header">
        <h1 id="titulo">Página de reseñas</h1>
        <p id="subtitulo">Dejá reseñas a los libros que leíste y lleva un registro.</p>
      </div>

      <Navbar active="home" />

      <main>
        <div className="hero">
          <h2>Bienvenido a tu biblioteca personal</h2>
          <p>
            Llevá un registro de lo que leíste, escribí tus impresiones y descubrí nuevas
            lecturas.
          </p>
        </div>

        <h2 className="section-title">✦ Recomendaciones</h2>

        <div className="recomendaciones-grid" id="recomendaciones">
          {recomendaciones.map((libro, index) => (
            <div
              className="rec-card"
              key={libro.id ?? `${libro.titulo}-${index}`}
              style={{ animationDelay: `${0.05 * (index + 1)}s` }}
            >
              <div className="rec-label">{libro.genero || "Recomendación"}</div>
              <h3>{libro.titulo}</h3>
              <p className="rec-autor">{libro.autor}</p>
              <p>{libro.descripcion || libro.resena}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
