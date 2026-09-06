"use client";

import { API_URL } from "../../lib/api";
import { useEffect, useState } from "react";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precioUnitario: number;
    stock: number;
}

interface VentaReporte {
    ventaId: number;
    fecha: string;
    clienteId: number;
    cliente: string;
    cantidadProductos: number;
    total: number;
}

export default function Dashboard() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const [productos, setProductos] = useState<Producto[]>([]);
    const [ventas, setVentas] = useState<VentaReporte[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedEmail = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");

        if (!token) {
            window.location.href = "/";
            return;
        }

        if (storedEmail) {
            setEmail(storedEmail);
        }

        if (storedRole) {
            setRole(storedRole);
        }

        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/";
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const hoy = new Date();

            const fechaFin = hoy
                .toISOString()
                .split("T")[0];

            const fechaInicioDate = new Date();

            fechaInicioDate.setDate(
                hoy.getDate() - 30
            );

            const fechaInicio = fechaInicioDate
                .toISOString()
                .split("T")[0];

            const [
                productosResponse,
                ventasResponse,
            ] = await Promise.all([
                fetch(
                    API_URL + "/api/Productos",
                    {
                        headers,
                    }
                ),

                fetch(
                    `${API_URL}/api/Reportes/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
                    {
                        headers,
                    }
                ),
            ]);

            if (
                productosResponse.status === 401 ||
                ventasResponse.status === 401
            ) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (productosResponse.ok) {
                const productosData =
                    await productosResponse.json();

                setProductos(productosData);
            }

            if (ventasResponse.ok) {
                const ventasData =
                    await ventasResponse.json();

                setVentas(ventasData);
            }
        } catch (error) {
            console.error(
                "Error cargando dashboard:",
                error
            );
        } finally {
            setCargando(false);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        window.location.href = "/";
    };

    const irA = (ruta: string) => {
        window.location.href = ruta;
    };

    const stockTotal = productos.reduce(
        (total, producto) =>
            total + producto.stock,
        0
    );

    const productosStockBajo =
        productos.filter(
            (producto) => producto.stock <= 5
        );

    const ventasTotal = ventas.reduce(
        (total, venta) =>
            total + venta.total,
        0
    );

    const cantidadVentas = ventas.length;

    return (
        <main className="min-h-screen bg-slate-100">
            {/* ENCABEZADO */}
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            Panel principal
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-800">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Resumen general del sistema de inventario
                        </p>
                    </div>

                    {/* USUARIO */}
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-700">
                                {email}
                            </p>

                            <span
                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${role === "Admin"
                                        ? "bg-violet-50 text-violet-600"
                                        : "bg-blue-50 text-blue-600"
                                    }`}
                            >
                                {role || "Usuario"}
                            </span>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                            {email
                                ? email
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                        </div>

                        <button
                            onClick={cerrarSesion}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            Cerrar sesiÃ³n
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENIDO */}
            <section className="p-8">
                {/* ESTADÃSTICAS */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {/* PRODUCTOS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Productos
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando
                                        ? "..."
                                        : productos.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                ðŸ“¦
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Productos registrados
                        </p>
                    </div>

                    {/* STOCK */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Stock total
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando
                                        ? "..."
                                        : stockTotal}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                ðŸ“Š
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Unidades disponibles
                        </p>
                    </div>

                    {/* VENTAS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Ventas
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando
                                        ? "..."
                                        : cantidadVentas}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                                ðŸ’°
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Ãšltimos 30 dÃ­as
                        </p>
                    </div>

                    {/* TOTAL */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total vendido
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando
                                        ? "..."
                                        : `$${ventasTotal.toFixed(
                                            2
                                        )}`}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                                ðŸ’µ
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Ãšltimos 30 dÃ­as
                        </p>
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="mt-8 grid gap-6 xl:grid-cols-3">
                    {/* STOCK BAJO */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Stock bajo
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Productos que requieren atenciÃ³n
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    irA("/productos")
                                }
                                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                            >
                                Ver productos â†’
                            </button>
                        </div>

                        <div className="p-6">
                            {cargando ? (
                                <div className="py-8 text-center text-sm text-slate-400">
                                    Cargando informaciÃ³n...
                                </div>
                            ) : productosStockBajo.length ===
                                0 ? (
                                <div className="rounded-xl bg-emerald-50 p-6 text-center">
                                    <p className="text-2xl">
                                        âœ“
                                    </p>

                                    <p className="mt-2 font-semibold text-emerald-700">
                                        Inventario en buen estado
                                    </p>

                                    <p className="mt-1 text-sm text-emerald-600">
                                        No hay productos con stock bajo.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                                                <th className="pb-3 font-semibold">
                                                    Producto
                                                </th>

                                                <th className="pb-3 font-semibold">
                                                    Precio
                                                </th>

                                                <th className="pb-3 text-right font-semibold">
                                                    Stock
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {productosStockBajo.map(
                                                (producto) => (
                                                    <tr
                                                        key={producto.id}
                                                        className="border-b border-slate-50 last:border-0"
                                                    >
                                                        <td className="py-4">
                                                            <p className="font-semibold text-slate-700">
                                                                {producto.nombre}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                ID #{producto.id}
                                                            </p>
                                                        </td>

                                                        <td className="py-4 text-sm text-slate-600">
                                                            $
                                                            {producto.precioUnitario.toFixed(
                                                                2
                                                            )}
                                                        </td>

                                                        <td className="py-4 text-right">
                                                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                                                                {producto.stock}{" "}
                                                                unidades
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACCESOS RÃPIDOS */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-800">
                                Accesos rÃ¡pidos
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Acciones frecuentes
                            </p>
                        </div>

                        <div className="space-y-3 p-6">
                            {/* ADMIN */}
                            {role === "Admin" && (
                                <>
                                    <button
                                        onClick={() =>
                                            irA("/productos")
                                        }
                                        className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                    >
                                        <span className="text-2xl">
                                            ðŸ“¦
                                        </span>

                                        <div>
                                            <p className="font-semibold text-slate-700">
                                                Productos
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Administrar inventario
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() =>
                                            irA("/proveedores")
                                        }
                                        className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                    >
                                        <span className="text-2xl">
                                            ðŸšš
                                        </span>

                                        <div>
                                            <p className="font-semibold text-slate-700">
                                                Proveedores
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Administrar proveedores
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() =>
                                            irA("/clientes")
                                        }
                                        className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                    >
                                        <span className="text-2xl">
                                            ðŸ‘¥
                                        </span>

                                        <div>
                                            <p className="font-semibold text-slate-700">
                                                Clientes
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Administrar clientes
                                            </p>
                                        </div>
                                    </button>
                                </>
                            )}

                            {/* COMPRAS */}
                            <button
                                onClick={() =>
                                    irA("/compras")
                                }
                                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="text-2xl">
                                    ðŸ›’
                                </span>

                                <div>
                                    <p className="font-semibold text-slate-700">
                                        Compras
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Registrar entrada de inventario
                                    </p>
                                </div>
                            </button>

                            {/* VENTAS */}
                            <button
                                onClick={() =>
                                    irA("/ventas")
                                }
                                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="text-2xl">
                                    ðŸ’°
                                </span>

                                <div>
                                    <p className="font-semibold text-slate-700">
                                        Ventas
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Registrar salida de inventario
                                    </p>
                                </div>
                            </button>

                            {/* REPORTES */}
                            <button
                                onClick={() =>
                                    irA("/reportes")
                                }
                                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <span className="text-2xl">
                                    ðŸ“ˆ
                                </span>

                                <div>
                                    <p className="font-semibold text-slate-700">
                                        Reportes
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Consultar ventas
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* VENTAS RECIENTES */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Ventas recientes
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Actividad de los Ãºltimos 30 dÃ­as
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                irA("/reportes")
                            }
                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                            Ver reporte â†’
                        </button>
                    </div>

                    <div className="p-6">
                        {cargando ? (
                            <div className="py-8 text-center text-sm text-slate-400">
                                Cargando ventas...
                            </div>
                        ) : ventas.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-3xl">
                                    ðŸ“Š
                                </p>

                                <p className="mt-2 font-semibold text-slate-600">
                                    No hay ventas recientes
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Las nuevas ventas aparecerÃ¡n aquÃ­.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                                            <th className="pb-3 font-semibold">
                                                Venta
                                            </th>

                                            <th className="pb-3 font-semibold">
                                                Cliente
                                            </th>

                                            <th className="pb-3 font-semibold">
                                                Fecha
                                            </th>

                                            <th className="pb-3 text-right font-semibold">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {ventas
                                            .slice()
                                            .reverse()
                                            .slice(0, 5)
                                            .map((venta) => (
                                                <tr
                                                    key={venta.ventaId}
                                                    className="border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="py-4 font-semibold text-slate-700">
                                                        #{venta.ventaId}
                                                    </td>

                                                    <td className="py-4 text-sm text-slate-600">
                                                        {venta.cliente}
                                                    </td>

                                                    <td className="py-4 text-sm text-slate-500">
                                                        {new Date(
                                                            venta.fecha
                                                        ).toLocaleDateString(
                                                            "es-SV"
                                                        )}
                                                    </td>

                                                    <td className="py-4 text-right font-bold text-slate-700">
                                                        $
                                                        {venta.total.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

