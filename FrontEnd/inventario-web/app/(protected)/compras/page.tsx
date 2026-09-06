"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useEffect, useState } from "react";

interface Producto {
    id: number;
    nombre: string;
    precioUnitario: number;
    stock: number;
}

interface Proveedor {
    id: number;
    nombre: string;
}

interface CompraDetalle {
    productoId: number;
    cantidad: number;
    precioCompra: number;
}

interface Compra {
    id: number;
    proveedorId: number;
    fecha: string;
    usuarioId: string;
    detalles: CompraDetalle[];
}

export default function Compras() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [compras, setCompras] = useState<Compra[]>([]);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [proveedorId, setProveedorId] = useState("");
    const [fecha, setFecha] = useState("");

    const [detalles, setDetalles] = useState<CompraDetalle[]>([
        {
            productoId: 0,
            cantidad: 1,
            precioCompra: 0,
        },
    ]);

    const cargarDatos = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const [
                productosResponse,
                proveedoresResponse,
                comprasResponse,
            ] = await Promise.all([
                fetch(API_URL + "/api/Productos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),

                fetch(API_URL + "/api/Proveedores", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),

                fetch(API_URL + "/api/Compras", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            if (
                productosResponse.status === 401 ||
                proveedoresResponse.status === 401 ||
                comprasResponse.status === 401
            ) {
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (
                !productosResponse.ok ||
                !proveedoresResponse.ok ||
                !comprasResponse.ok
            ) {
                throw new Error();
            }

            const productosData = await productosResponse.json();
            const proveedoresData = await proveedoresResponse.json();
            const comprasData = await comprasResponse.json();

            setProductos(productosData);
            setProveedores(proveedoresData);
            setCompras(comprasData);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar los datos.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();

        const hoy = new Date().toISOString().split("T")[0];
        setFecha(hoy);
    }, []);

    const agregarDetalle = () => {
        setDetalles((detallesActuales) => [
            ...detallesActuales,
            {
                productoId: 0,
                cantidad: 1,
                precioCompra: 0,
            },
        ]);
    };

    const eliminarDetalle = (index: number) => {
        if (detalles.length === 1) {
            return;
        }

        setDetalles(
            detalles.filter((_, i) => i !== index)
        );
    };

    const actualizarDetalle = (
        index: number,
        campo: keyof CompraDetalle,
        valor: number
    ) => {
        const nuevosDetalles = [...detalles];

        nuevosDetalles[index] = {
            ...nuevosDetalles[index],
            [campo]: valor,
        };

        setDetalles(nuevosDetalles);
    };

    const limpiarFormulario = () => {
        setProveedorId("");
        setFecha(
            new Date().toISOString().split("T")[0]
        );

        setDetalles([
            {
                productoId: 0,
                cantidad: 1,
                precioCompra: 0,
            },
        ]);

        setMostrarFormulario(false);
    };

    const crearCompra = async (e: FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setMensaje("");
        setError("");

        if (!proveedorId) {
            setError("Debes seleccionar un proveedor.");
            return;
        }

        const detalleInvalido = detalles.some(
            (detalle) =>
                detalle.productoId <= 0 ||
                detalle.cantidad <= 0 ||
                detalle.precioCompra <= 0
        );

        if (detalleInvalido) {
            setError(
                "Todos los productos deben tener una cantidad y precio de compra válidos."
            );
            return;
        }

        setGuardando(true);

        try {
            const response = await fetch(
                API_URL + "/api/Compras",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        proveedorId: Number(proveedorId),
                        fecha: fecha
                            ? `${fecha}T00:00:00`
                            : new Date().toISOString(),
                        detalles,
                    }),
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
                    "No tienes permisos para registrar compras."
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
                        "No se pudo registrar la compra."
                    );
                }

                return;
            }

            setMensaje("Compra registrada correctamente.");

            limpiarFormulario();

            await cargarDatos();
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setGuardando(false);
        }
    };

    const obtenerNombreProducto = (id: number) => {
        const producto = productos.find(
            (producto) => producto.id === id
        );

        return producto?.nombre || "Producto desconocido";
    };

    const obtenerNombreProveedor = (id: number) => {
        const proveedor = proveedores.find(
            (proveedor) => proveedor.id === id
        );

        return proveedor?.nombre || "Proveedor desconocido";
    };

    const calcularTotal = (compra: Compra) => {
        return compra.detalles.reduce(
            (total, detalle) =>
                total +
                detalle.cantidad * detalle.precioCompra,
            0
        );
    };

    const totalFormulario = detalles.reduce(
        (total, detalle) =>
            total +
            detalle.cantidad * detalle.precioCompra,
        0
    );

    return (
        <main className="min-h-screen bg-slate-100">
            {/* ENCABEZADO */}
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            Gestión de inventario
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-800">
                            Compras
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Registra compras y aumenta automáticamente el stock.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            window.location.href = "/dashboard";
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                        ← Dashboard
                    </button>
                </div>
            </div>

            <section className="p-8">
                {/* ESTADÍSTICAS */}
                <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Compras registradas
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : compras.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                🛒
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Historial de compras
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Productos disponibles
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : productos.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                📦
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Productos en catálogo
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Proveedores
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : proveedores.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                                🚚
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            Proveedores registrados
                        </p>
                    </div>
                </div>

                {/* ACCIONES */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Historial de compras
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Consulta las compras registradas y sus detalles.
                        </p>
                    </div>

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
                            : "+ Nueva compra"}
                    </button>
                </div>

                {/* MENSAJE */}
                {mensaje && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 font-bold">
                            ✓
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

                {/* FORMULARIO */}
                {mostrarFormulario && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                    🛒
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Nueva compra
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Selecciona el proveedor y agrega los productos recibidos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={crearCompra}
                            className="p-6"
                        >
                            {/* PROVEEDOR Y FECHA */}
                            <div className="mb-8 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Proveedor
                                    </label>

                                    <select
                                        value={proveedorId}
                                        onChange={(e) =>
                                            setProveedorId(e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            Seleccionar proveedor
                                        </option>

                                        {proveedores.map((proveedor) => (
                                            <option
                                                key={proveedor.id}
                                                value={proveedor.id}
                                            >
                                                {proveedor.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Fecha de compra
                                    </label>

                                    <input
                                        type="date"
                                        value={fecha}
                                        onChange={(e) =>
                                            setFecha(e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* DETALLES */}
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Productos
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Agrega uno o varios productos a la compra.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={agregarDetalle}
                                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                                >
                                    + Agregar producto
                                </button>
                            </div>

                            <div className="space-y-4">
                                {detalles.map((detalle, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-700">
                                                Producto #{index + 1}
                                            </p>

                                            {detalles.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarDetalle(index)
                                                    }
                                                    className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-3">
                                            {/* PRODUCTO */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Producto
                                                </label>

                                                <select
                                                    value={detalle.productoId}
                                                    onChange={(e) =>
                                                        actualizarDetalle(
                                                            index,
                                                            "productoId",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    required
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value={0}>
                                                        Seleccionar producto
                                                    </option>

                                                    {productos.map((producto) => (
                                                        <option
                                                            key={producto.id}
                                                            value={producto.id}
                                                        >
                                                            {producto.nombre} — Stock:{" "}
                                                            {producto.stock}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* CANTIDAD */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Cantidad
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={detalle.cantidad}
                                                    onChange={(e) =>
                                                        actualizarDetalle(
                                                            index,
                                                            "cantidad",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    required
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>

                                            {/* PRECIO */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Precio de compra
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={detalle.precioCompra}
                                                    onChange={(e) =>
                                                        actualizarDetalle(
                                                            index,
                                                            "precioCompra",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    required
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>
                                        </div>

                                        {/* SUBTOTAL */}
                                        <div className="mt-4 flex justify-end">
                                            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                                                <span className="text-xs font-medium text-slate-400">
                                                    Subtotal
                                                </span>

                                                <p className="text-lg font-bold text-slate-800">
                                                    $
                                                    {(
                                                        detalle.cantidad *
                                                        detalle.precioCompra
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL */}
                            <div className="mt-6 flex justify-end">
                                <div className="min-w-[260px] rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-sm">
                                    <p className="text-sm text-slate-300">
                                        Total de la compra
                                    </p>

                                    <p className="mt-1 text-3xl font-bold">
                                        ${totalFormulario.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* BOTONES */}
                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={limpiarFormulario}
                                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {guardando
                                        ? "Registrando..."
                                        : "Registrar compra"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* CARGANDO */}
                {cargando && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Cargando compras...
                        </p>
                    </div>
                )}

                {/* LISTADO */}
                {!cargando && (
                    <div className="space-y-5">
                        {compras.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                                <div className="text-5xl">
                                    🛒
                                </div>

                                <p className="mt-4 font-semibold text-slate-600">
                                    No hay compras registradas
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Las compras que registres aparecerán aquí.
                                </p>
                            </div>
                        ) : (
                            compras.map((compra) => (
                                <div
                                    key={compra.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* CABECERA */}
                                    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-100 bg-slate-50 px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                                🛒
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                                    Compra registrada
                                                </p>

                                                <h2 className="mt-1 text-xl font-bold text-slate-800">
                                                    Compra #{compra.id}
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {obtenerNombreProveedor(
                                                        compra.proveedorId
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Total
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-emerald-600">
                                                ${calcularTotal(compra).toFixed(2)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {new Date(
                                                    compra.fecha
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* DETALLES */}
                                    <div className="p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-800">
                                                    Detalles de la compra
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {compra.detalles.length}{" "}
                                                    {compra.detalles.length === 1
                                                        ? "producto"
                                                        : "productos"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                                            <table className="w-full min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-slate-200 bg-slate-50">
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Producto
                                                        </th>

                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Cantidad
                                                        </th>

                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Precio
                                                        </th>

                                                        <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-slate-100">
                                                    {compra.detalles.map(
                                                        (detalle, index) => (
                                                            <tr
                                                                key={index}
                                                                className="transition hover:bg-slate-50"
                                                            >
                                                                <td className="px-5 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                                                                            📦
                                                                        </div>

                                                                        <span className="text-sm font-semibold text-slate-700">
                                                                            {obtenerNombreProducto(
                                                                                detalle.productoId
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                                    {detalle.cantidad}
                                                                </td>

                                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                                    $
                                                                    {detalle.precioCompra.toFixed(
                                                                        2
                                                                    )}
                                                                </td>

                                                                <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                                                                    $
                                                                    {(
                                                                        detalle.cantidad *
                                                                        detalle.precioCompra
                                                                    ).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

