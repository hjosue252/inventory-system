"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        setMensaje("");
        setCargando(true);

        try {
            const response = await fetch("https://localhost:7166/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message || "Correo o contraseña incorrectos.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            router.push("/dashboard");
        } catch (error) {
            console.error(error);

            setMensaje(
                "No se pudo conectar con el servidor. Verifica que la API esté ejecutándose."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Inventario
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Iniciar sesión
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </form>

                {mensaje && (
                    <div className="mt-4 rounded-md bg-gray-100 p-3 text-center text-sm">
                        {mensaje}
                    </div>
                )}
            </div>
        </main>
    );
}