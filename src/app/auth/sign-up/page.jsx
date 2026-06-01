
"use client";

import { useState } from "react";
import Link from "next/link";
import "../../styles.css";
import { createClient } from "@/utils/supabase/client.js";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [name, setName] = useState("");
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
        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            const { data, error: signError } = await supabase.auth.signUp({ 
                email: email, 
                password: password,  
            });
            const user = data?.user;
                if (user) {
                    const { error: updateError } = await supabase.from("profiles").insert({ username: name }).eq("id", user.id);
                }
            if (signError) {
                setError(signError.message || "Error al crear cuenta.");
            } else {
                setMessage("Cuenta creada.");
                setEmail("");
                setPassword("");
                setConfirm("");
                setName("");
                router.push("/auth/sign-in");
            }
        } catch (err) {
            setError(err?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-xl mx-auto my-8 p-4">
            <header id="header">
                <h1 id="titulo">Crear cuenta</h1>
                <p id="subtitulo">Regístrate para empezar a guardar tus reseñas.</p>
            </header>

            <nav id="nav">
                <Link href="/">Home</Link>
                <Link href="/auth/sign-in">Ingresar</Link>
            </nav>

            <form className="formulario-box mt-5" onSubmit={handleSubmit}>
                <h2>Registro</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />

                <div className="full-col flex gap-2 justify-end">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-brown text-cream rounded">
                        {loading ? "Creando…" : "Crear cuenta"}
                    </button>
                </div>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                <p className="mt-2">
                    ¿Ya tenés cuenta? <Link className="text-blue-800 hover:underline" href="/auth/sign-in">Ingresá</Link>
                </p>
            </form>
        </main>
    );
}