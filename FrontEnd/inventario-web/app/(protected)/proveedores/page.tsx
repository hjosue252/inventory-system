"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useEffect, useState } from "react";

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

export default function Proveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [role, setRole] = useState("");

    const cargarProveedores = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch(
                API_URL + "/api/Proveedores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();

            setProveedores(data);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar los proveedores.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("role");

        if (storedRole) {
            setRole(storedRole);
        }

        cargarProveedores();
    }, []);

    const limpiarFormulario = () => {
        setNombre("");
        setEmail("");
        setTelefono("");
        setEditandoId(null);
        setMostrarFormulario(false);
    };

    const guardarProveedor = async (e: FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setGuardando(true);
        setMensaje("");
        setError("");

        try {
            const url =
                editandoId === null
                    ? API_URL + "/api/Proveedores"
                    : `${API_URL}/api/Proveedores/${editandoId}`;

            const method = editandoId === null ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    telefono,
                }),
            });

            const data = await response.json().catch(() => null);

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (response.status === 403) {
                setError(
                    "No tienes permisos para realizar esta acciÃ³n."
                );
                return;
            }

            if (!response.ok) {
                if (data?.errors) {
                    const errores = Object.values(data.errors)
                        .flat()
                        .join(" ");

                    setError(errores);
                } else {
                    setError(
                        data?.message ||
                        "No se pudo guardar el proveedor."
                    );
                }

                return;
            }

            setMensaje(
                editandoId === null
                    ? "Proveedor creado correctamente."
                    : "Proveedor actualizado correctamente."
            );

            limpiarFormulario();

            await cargarProveedores();
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setGuardando(false);
        }
    };

    const editarProveedor = (proveedor: Proveedor) => {
        setEditandoId(proveedor.id);
        setNombre(proveedor.nombre);
        setEmail(proveedor.email);
        setTelefono(proveedor.telefono);

        setMostrarFormulario(true);
        setMensaje("");
        setError("");
    };

    const eliminarProveedor = async (id: number) => {
        const confirmar = window.confirm(
            "Â¿EstÃ¡s seguro de que deseas eliminar este proveedor?"
        );

        if (!confirmar) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setMensaje("");
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/api/Proveedores/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (response.status === 403) {
                setError(
                    "No tienes permisos para eliminar proveedores."
                );
                return;
            }

            if (!response.ok) {
                setError(
                    data?.message ||
                    "No se pudo eliminar el proveedor."
                );

                return;
            }

            setMensaje("Proveedor eliminado correctamente.");

            await cargarProveedores();
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        }
    };

    return (
        <main className="min-h-screen bg-slate-100">
            {/* Encabezado */}
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            GestiÃ³n de proveedores
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-800">
                            Proveedores
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Administra los proveedores relacionados con tu inventario.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            window.location.href = "/dashboard";
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                        â† Dashboard
                    </button>
                </div>
            </div>

            <section className="p-8">
                {/* EstadÃ­stica */}
                <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Proveedores registrados
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : proveedores.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                ðŸšš
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Proveedores disponibles
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Lista de proveedores
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Consulta y administra la informaciÃ³n registrada.
                        </p>
                    </div>

                    {role === "Admin" && (
                        <button
                            onClick={() => {
                                if (mostrarFormulario) {
                                    limpiarFormulario();
                                } else {
                                    setMostrarFormulario(true);
                                    setMensaje("");
                                    setError("");
                                }
                            }}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                            {mostrarFormulario
                                ? "Cancelar"
                                : "+ Nuevo proveedor"}
                        </button>
                    )}
                </div>

                {/* Formulario */}
                {mostrarFormulario && role === "Admin" && (
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-800">
                                {editandoId === null
                                    ? "Nuevo proveedor"
                                    : "Editar proveedor"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Completa la informaciÃ³n del proveedor.
                            </p>
                        </div>

                        <form
                            onSubmit={guardarProveedor}
                            className="grid gap-5 p-6 md:grid-cols-3"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) =>
                                        setNombre(e.target.value)
                                    }
                                    placeholder="Ej. Proveedor TecnolÃ³gico S.A."
                                    required
                                    maxLength={100}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Correo electrÃ³nico
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="proveedor@empresa.com"
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    TelÃ©fono
                                </label>

                                <input
                                    type="text"
                                    value={telefono}
                                    onChange={(e) =>
                                        setTelefono(e.target.value)
                                    }
                                    placeholder="7000-0000"
                                    maxLength={20}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex gap-3 md:col-span-3">
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {guardando
                                        ? "Guardando..."
                                        : editandoId === null
                                            ? "Guardar proveedor"
                                            : "Actualizar proveedor"}
                                </button>

                                <button
                                    type="button"
                                    onClick={limpiarFormulario}
                                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Mensaje */}
                {mensaje && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 font-bold">
                            âœ“
                        </span>

                        {mensaje}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 font-bold">
                            !
                        </span>

                        {error}
                    </div>
                )}

                {/* Cargando */}
                {cargando && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Cargando proveedores...
                        </p>
                    </div>
                )}

                {/* Tabla */}
                {!cargando && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            ID
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Proveedor
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Correo
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            TelÃ©fono
                                        </th>

                                        {role === "Admin" && (
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Acciones
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {proveedores.map((proveedor) => (
                                        <tr
                                            key={proveedor.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                                #{proveedor.id}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                                                        ðŸšš
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {proveedor.nombre}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Proveedor registrado
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {proveedor.email}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {proveedor.telefono || "No registrado"}
                                            </td>

                                            {role === "Admin" && (
                                                <td className="px-6 py-5">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                editarProveedor(proveedor)
                                                            }
                                                            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                eliminarProveedor(
                                                                    proveedor.id
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                    {proveedores.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={role === "Admin" ? 5 : 4}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="text-4xl">
                                                    ðŸšš
                                                </div>

                                                <p className="mt-3 font-semibold text-slate-600">
                                                    No hay proveedores registrados
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Los proveedores que agregues aparecerÃ¡n aquÃ­.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

