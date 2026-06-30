"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../styles.css";
import { createClient } from "@/utils/supabase/client.js";

const supabase = createClient();

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Completa email y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message || "Error al iniciar sesión.");
      } else {
        setMessage("Ingresando…");
        router.push("/");
      }
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto my-8 p-4">
      <header id="header">
        <h1 id="titulo">Ingresar</h1>
        <p id="subtitulo">Accedé a tu cuenta para gestionar tus reseñas.</p>
      </header>

      <nav id="nav">
        <Link href="/">Home</Link>
        <Link href="/auth/sign-up">Crear cuenta</Link>
      </nav>

      <form className="formulario-box mt-5" onSubmit={handleSubmit}>
        <h2>Inicio de sesión</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          data-testid="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          data-testid="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="full-col flex gap-2 justify-end">
          <button type="submit" name="Ingresar" disabled={loading} className="px-4 py-2 bg-brown text-cream rounded">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </div>

        <div data-testid="mensaje">
          {message && <p className="text-green-600">{message}</p>}
        </div>
        {error && <p className="text-red-600">{error}</p>}

        <p className="mt-2">
          ¿No tenés cuenta? <Link className="text-blue-800 hover:underline" href="/auth/sign-up">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
