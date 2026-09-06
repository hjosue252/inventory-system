"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarKey, setSidebarKey] = useState(0);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        setSidebarKey((previous) => previous + 1);

        window.location.href = "/";
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-100">
                <Sidebar
                    key={sidebarKey}
                    onLogout={cerrarSesion}
                />

                <main className="min-h-screen pl-64">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
