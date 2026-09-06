"use client";

import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const [autenticado, setAutenticado] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setAutenticado(true);
        setCargando(false);
    }, []);

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="rounded-lg bg-white p-6 shadow">
                    Verificando sesiÃ³n...
                </div>
            </main>
        );
    }

    if (!autenticado) {
        return null;
    }

    return <>{children}</>;
}
