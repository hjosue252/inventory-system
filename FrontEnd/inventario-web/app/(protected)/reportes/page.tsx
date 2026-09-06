"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useEffect, useState } from "react";

interface ReporteVenta {
    ventaId: number;
    fecha: string;
    clienteId: number;
    cliente: string;
    cantidadProductos: number;
    total: number;
}

export default function Reportes() {
    const [reportes, setReportes] = useState<ReporteVenta[]>([]);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        const hoy = new Date();

        const primerDiaMes = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            1
        );

        setFechaInicio(
            primerDiaMes.toISOString().split("T")[0]
        );

        setFechaFin(
            hoy.toISOString().split("T")[0]
        );
    }, []);

    const consultarReporte = async (e: FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setError("");
        setMensaje("");

        if (!fechaInicio || !fechaFin) {
            setError(
                "Debes seleccionar una fecha inicial y una fecha final."
            );
            return;
        }

        if (fechaInicio > fechaFin) {
            setError(
                "La fecha inicial no puede ser posterior a la fecha final."
            );
            return;
        }

        setCargando(true);

        try {
            const url =
                `${API_URL}/api/Reportes/ventas` +
                `?fechaInicio=${fechaInicio}` +
                `&fechaFin=${fechaFin}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json().catch(() => null);

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (response.status === 403) {
                setError(
                    "No tienes permisos para consultar este reporte."
                );
                return;
            }

            if (!response.ok) {
                setError(
                    data?.message ||
                    "No se pudo obtener el reporte."
                );
                return;
            }

            setReportes(data);

            if (data.length === 0) {
                setMensaje(
                    "No se encontraron ventas en el perÃ­odo seleccionado."
                );
            } else {
                setMensaje(
                    `Se encontraron ${data.length} venta${data.length === 1 ? "" : "s"
                    }.`
                );
            }
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    const totalGeneral = reportes.reduce(
        (total, reporte) => total + reporte.total,
        0
    );

    const cantidadTotalProductos = reportes.reduce(
        (total, reporte) =>
            total + reporte.cantidadProductos,
        0
    );

    return (
        <main className="min-h-screen bg-slate-100">
            {/* ENCABEZADO */}
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            AnÃ¡lisis de ventas
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-800">
                            Reportes
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Consulta y analiza las ventas realizadas por perÃ­odo.
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
                {/* FILTROS */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                ðŸ“Š
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Filtrar ventas
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Selecciona el perÃ­odo que deseas consultar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={consultarReporte}
                        className="grid gap-5 p-6 md:grid-cols-3"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Fecha inicial
                            </label>

                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) =>
                                    setFechaInicio(e.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Fecha final
                            </label>

                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) =>
                                    setFechaFin(e.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={cargando}
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cargando
                                    ? "Consultando..."
                                    : "Consultar reporte"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* MENSAJE */}
                {mensaje && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-bold">
                            âœ“
                        </span>

                        {mensaje}
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 font-bold">
                            !
                        </span>

                        {error}
                    </div>
                )}

                {/* RESUMEN */}
                {reportes.length > 0 && (
                    <div className="mb-6 grid gap-5 md:grid-cols-3">
                        {/* VENTAS */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Ventas realizadas
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-800">
                                        {reportes.length}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                    ðŸ’°
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                En el perÃ­odo seleccionado
                            </p>
                        </div>

                        {/* PRODUCTOS */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Productos vendidos
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-800">
                                        {cantidadTotalProductos}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                                    ðŸ“¦
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Unidades vendidas
                            </p>
                        </div>

                        {/* TOTAL */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total vendido
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                                        ${totalGeneral.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                    ðŸ’µ
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                Ingresos del perÃ­odo
                            </p>
                        </div>
                    </div>
                )}

                {/* TABLA */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Resultados
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Detalle de las ventas encontradas.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Venta
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Fecha
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Cliente
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Productos
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {reportes.map((reporte) => (
                                    <tr
                                        key={reporte.ventaId}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                                    ðŸ’°
                                                </div>

                                                <span className="text-sm font-bold text-slate-700">
                                                    #{reporte.ventaId}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(
                                                reporte.fecha
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {reporte.cliente}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Cliente #{reporte.clienteId}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {reporte.cantidadProductos}
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-emerald-600">
                                                ${reporte.total.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {reportes.length === 0 && !cargando && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-14 text-center"
                                        >
                                            <div className="text-5xl">
                                                ðŸ“Š
                                            </div>

                                            <p className="mt-4 font-semibold text-slate-600">
                                                No hay ventas para mostrar
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Selecciona otro perÃ­odo para consultar resultados.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}

