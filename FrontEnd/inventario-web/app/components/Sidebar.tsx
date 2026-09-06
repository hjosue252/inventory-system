"use client";

import { useEffect, useState } from "react";

interface SidebarProps {
    onLogout: () => void;
}

interface OpcionMenu {
    nombre: string;
    ruta: string;
    icono: string;
    soloAdmin: boolean;
}

export default function Sidebar({
    onLogout,
}: SidebarProps) {
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [rutaActual, setRutaActual] = useState("");

    useEffect(() => {
        const storedRole =
            localStorage.getItem("role");

        const storedEmail =
            localStorage.getItem("email");

        if (storedRole) {
            setRole(storedRole);
        }

        if (storedEmail) {
            setEmail(storedEmail);
        }

        setRutaActual(window.location.pathname);
    }, []);

    const opciones: OpcionMenu[] = [
        {
            nombre: "Dashboard",
            ruta: "/dashboard",
            icono: "âŒ‚",
            soloAdmin: false,
        },
        {
            nombre: "Productos",
            ruta: "/productos",
            icono: "â–£",
            soloAdmin: true,
        },
        {
            nombre: "Proveedores",
            ruta: "/proveedores",
            icono: "â–°",
            soloAdmin: true,
        },
        {
            nombre: "Clientes",
            ruta: "/clientes",
            icono: "â™™",
            soloAdmin: true,
        },
        {
            nombre: "Compras",
            ruta: "/compras",
            icono: "ðŸ›’",
            soloAdmin: false,
        },
        {
            nombre: "Ventas",
            ruta: "/ventas",
            icono: "â–¤",
            soloAdmin: false,
        },
        {
            nombre: "Reportes",
            ruta: "/reportes",
            icono: "â–¥",
            soloAdmin: false,
        },
    ];

    const opcionesVisibles =
        opciones.filter(
            (opcion) =>
                !opcion.soloAdmin ||
                role === "Admin"
        );

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
            {/* LOGO */}
            <div className="border-b border-slate-800 px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold shadow-lg shadow-blue-900/30">
                        I
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight">
                            Inventario
                        </h1>

                        <p className="text-xs text-slate-400">
                            Sistema de gestiÃ³n
                        </p>
                    </div>
                </div>
            </div>

            {/* NAVEGACIÃ“N */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    MenÃº principal
                </p>

                <div className="space-y-1">
                    {opcionesVisibles.map(
                        (opcion) => {
                            const activa =
                                rutaActual ===
                                opcion.ruta;

                            return (
                                <button
                                    key={opcion.ruta}
                                    onClick={() => {
                                        window.location.href =
                                            opcion.ruta;
                                    }}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${activa
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                        }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition ${activa
                                                ? "bg-white/15 text-white"
                                                : "text-slate-500 group-hover:text-slate-200"
                                            }`}
                                    >
                                        {
                                            opcion.icono
                                        }
                                    </span>

                                    <span>
                                        {
                                            opcion.nombre
                                        }
                                    </span>

                                    {activa && (
                                        <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                                    )}
                                </button>
                            );
                        }
                    )}
                </div>
            </nav>

            {/* USUARIO */}
            <div className="border-t border-slate-800 p-4">
                <div className="mb-3 rounded-xl bg-slate-900 p-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                            {email
                                ? email
                                    .charAt(
                                        0
                                    )
                                    .toUpperCase()
                                : "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-500">
                                SesiÃ³n actual
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-slate-200">
                                {email ||
                                    "Usuario"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 border-t border-slate-800 pt-3">
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${role ===
                                    "Admin"
                                    ? "bg-violet-500/10 text-violet-400"
                                    : "bg-blue-500/10 text-blue-400"
                                }`}
                        >
                            {role ||
                                "Usuario"}
                        </span>
                    </div>
                </div>

                {/* LOGOUT */}
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-lg">
                        â†ª
                    </span>

                    <span>
                        Cerrar sesiÃ³n
                    </span>
                </button>
            </div>
        </aside>
    );
}
