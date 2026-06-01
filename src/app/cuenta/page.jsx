"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "../styles.css";
import { createClient } from "@/utils/supabase/client.js";

const supabase = createClient();

export default function CuentaPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [nickname, setNickname] = useState("");
	useEffect(() => {
		let mounted = true;

		async function loadUser() {
			const { data, error: userError } = await supabase.auth.getUser();

			if (userError) {
				if (mounted) {
					setError(userError.message || "No se pudo cargar la cuenta.");
					setLoading(false);
				}
				return;
			}

			const user = data?.user;

			if (!user) {
				router.push("/auth/sign-in");
				return;
			}

			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("apodo, username")
				.eq("id", user.id)
				.single();

			if (profileError && profileError.code !== "PGRST116") {
				if (mounted) {
					setError(profileError.message || "No se pudo cargar el perfil.");
					setLoading(false);
				}
				return;
			}

			if (mounted) {
				setEmail(user.email || "");
				setName(profile?.username || user.user_metadata?.name || user.user_metadata?.username || "");
				setNickname(profile?.apodo || user.user_metadata?.nickname || "");
				setLoading(false);
			}
		}

		loadUser();

		return () => {
			mounted = false;
		};
	}, [router]);

	async function handleSubmit(e) {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			setSaving(true);

			const { data: userData, error: userError } = await supabase.auth.getUser();

			if (userError) {
				setError(userError.message || "No se pudo actualizar el perfil.");
				return;
			}

			const user = userData?.user;
			if (!user) {
				router.push("/auth/sign-in");
				return;
			}

			const { error: profileError } = await supabase.from("profiles").upsert({
				id: user.id,
				username: name.trim(),
				apodo: nickname.trim(),
			});

			if (profileError) {
				setError(profileError.message || "No se pudo actualizar el perfil.");
				return;
			}

			setMessage("Cuenta actualizada correctamente.");
		} catch (err) {
			setError(err?.message || String(err));
		} finally {
			setSaving(false);
		}
	}

	async function handleLogout() {
		setMessage("");
		setError("");

		const { error: signOutError } = await supabase.auth.signOut();

		if (signOutError) {
			setError(signOutError.message || "No se pudo cerrar sesión.");
			return;
		}

		router.push("/auth/sign-in");
	}

	return (
		<main className="max-w-2xl mx-auto my-8 p-4">
			<header id="header">
				<h1 id="titulo">Mi cuenta</h1>
				<p id="subtitulo">Revisá tus datos y actualizá tu perfil.</p>
			</header>

			<Navbar active="cuenta" />

			{loading ? (
				<p className="sin-resultados">Cargando cuenta...</p>
			) : (
				<section className="formulario-box mt-5">
					<h2>Datos de la cuenta</h2>

					<label className="full-col flex flex-col gap-2">
						<span className="text-sm italic text-[color:var(--brown)]">Email</span>
						<input type="email" value={email} readOnly className="opacity-80" />
					</label>

					<form className="contents" onSubmit={handleSubmit}>
						<label className="flex flex-col gap-2">
							<span className="text-sm italic text-[color:var(--brown)]">Nombre</span>
							<input
								type="text"
								placeholder="Nombre"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</label>

						<label className="flex flex-col gap-2">
							<span className="text-sm italic text-[color:var(--brown)]">Apodo</span>
							<input
								type="text"
								placeholder="Apodo"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
							/>
						</label>

						<div className="full-col flex flex-wrap items-center justify-between gap-2">
							<button
								type="button"
								onClick={handleLogout}
								className="w-44 h-12 px-4 py-2 rounded-md border border-red-700 bg-red-50 text-red-700 shadow-sm transition-colors hover:bg-red-100 hover:border-red-600 hover:text-red-800"
							>
								Cerrar sesión
							</button>
							<button type="submit" disabled={saving} className="px-4 py-2 bg-brown text-cream rounded">
								{saving ? "Guardando…" : "Guardar cambios"}
							</button>
						</div>

						{message && <p className="full-col text-green-700">{message}</p>}
						{error && <p className="full-col text-red-700">{error}</p>}
					</form>
				</section>
			)}
		</main>
	);
}
