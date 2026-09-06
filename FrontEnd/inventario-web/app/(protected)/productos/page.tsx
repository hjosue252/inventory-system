"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useEffect, useState } from "react";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precioUnitario: number;
    stock: number;
}

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precioUnitario, setPrecioUnitario] = useState("");
    const [stock, setStock] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [role, setRole] = useState("");

    const cargarProductos = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch(
                API_URL + "/api/Productos",
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
            setProductos(data);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar los productos.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("role");

        if (storedRole) {
            setRole(storedRole);
        }

        cargarProductos();
    }, []);

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setPrecioUnitario("");
        setStock("");
        setEditandoId(null);
        setMostrarFormulario(false);
    };

    const guardarProducto = async (e: FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        setGuardando(true);
        setMensaje("");
        setError("");

        const producto = {
            nombre,
            descripcion,
            precioUnitario: Number(precioUnitario),
            stock: Number(stock),
        };

        try {
            const url =
                editandoId === null
                    ? API_URL + "/api/Productos"
                    : `${API_URL}/api/Productos/${editandoId}`;

            const method = editandoId === null ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(producto),
            });

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
                const data = await response.json().catch(() => null);

                if (data?.errors) {
                    const errores = Object.values(data.errors)
                        .flat()
                        .join(" ");

                    setError(errores);
                } else {
                    setError(
                        data?.message || "No se pudo guardar el producto."
                    );
                }

                return;
            }

            setMensaje(
                editandoId === null
                    ? "Producto creado correctamente."
                    : "Producto actualizado correctamente."
            );

            limpiarFormulario();
            await cargarProductos();
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setGuardando(false);
        }
    };

    const editarProducto = (producto: Producto) => {
        setEditandoId(producto.id);
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setPrecioUnitario(producto.precioUnitario.toString());
        setStock(producto.stock.toString());
        setMostrarFormulario(true);
        setMensaje("");
        setError("");
    };

    const eliminarProducto = async (id: number) => {
        const confirmar = window.confirm(
            "Â¿EstÃ¡s seguro de que deseas eliminar este producto?"
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
                `${API_URL}/api/Productos/${id}`,
                {
                    method: "DELETE",
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

            if (response.status === 403) {
                setError(
                    "No tienes permisos para eliminar productos."
                );
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                setError(
                    data?.message || "No se pudo eliminar el producto."
                );

                return;
            }

            setMensaje("Producto eliminado correctamente.");

            await cargarProductos();
        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor.");
        }
    };

    const productosStockBajo = productos.filter(
        (producto) => producto.stock <= 5
    );

    const stockTotal = productos.reduce(
        (total, producto) => total + producto.stock,
        0
    );

    return (
        <main className="min-h-screen bg-slate-100">
            {/* Encabezado */}
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6">
                    <div>
                        <p className="text-sm font-medium text-blue-600">
                            GestiÃ³n de inventario
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-800">
                            Productos
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Administra los productos y controla las existencias.
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
                {/* EstadÃ­sticas */}
                <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Productos registrados
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : productos.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                ðŸ“¦
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Unidades en inventario
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : stockTotal}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                ðŸ“Š
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Stock bajo
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {cargando ? "..." : productosStockBajo.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                                âš ï¸
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Lista de productos
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Consulta y administra los productos registrados.
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
                                : "+ Nuevo producto"}
                        </button>
                    )}
                </div>

                {/* Formulario */}
                {mostrarFormulario && role === "Admin" && (
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-800">
                                {editandoId === null
                                    ? "Nuevo producto"
                                    : "Editar producto"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Completa la informaciÃ³n del producto.
                            </p>
                        </div>

                        <form
                            onSubmit={guardarProducto}
                            className="grid gap-5 p-6 md:grid-cols-2"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej. Laptop Dell"
                                    required
                                    maxLength={100}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Precio unitario
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                        $
                                    </span>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={precioUnitario}
                                        onChange={(e) =>
                                            setPrecioUnitario(e.target.value)
                                        }
                                        placeholder="0.00"
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-8 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    DescripciÃ³n
                                </label>

                                <textarea
                                    value={descripcion}
                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }
                                    placeholder="Describe las caracterÃ­sticas del producto..."
                                    maxLength={500}
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex items-end gap-3">
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="flex-1 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {guardando
                                        ? "Guardando..."
                                        : editandoId === null
                                            ? "Guardar producto"
                                            : "Actualizar producto"}
                                </button>

                                <button
                                    type="button"
                                    onClick={limpiarFormulario}
                                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Mensaje de Ã©xito */}
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
                            Cargando productos...
                        </p>
                    </div>
                )}

                {/* Tabla */}
                {!cargando && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            ID
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Producto
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            DescripciÃ³n
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Precio
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Stock
                                        </th>

                                        {role === "Admin" && (
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Acciones
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {productos.map((producto) => (
                                        <tr
                                            key={producto.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                                #{producto.id}
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-slate-800">
                                                    {producto.nombre}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Producto de inventario
                                                </p>
                                            </td>

                                            <td className="max-w-xs px-6 py-5 text-sm text-slate-500">
                                                <p className="truncate">
                                                    {producto.descripcion ||
                                                        "Sin descripciÃ³n"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                                                ${producto.precioUnitario.toFixed(2)}
                                            </td>

                                            <td className="px-6 py-5">
                                                {producto.stock <= 5 ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                                        {producto.stock} unidades
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                        {producto.stock} unidades
                                                    </span>
                                                )}
                                            </td>

                                            {role === "Admin" && (
                                                <td className="px-6 py-5">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                editarProducto(producto)
                                                            }
                                                            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                eliminarProducto(producto.id)
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

                                    {productos.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={role === "Admin" ? 6 : 5}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="text-4xl">
                                                    ðŸ“¦
                                                </div>

                                                <p className="mt-3 font-semibold text-slate-600">
                                                    No hay productos registrados
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Los productos que agregues aparecerÃ¡n aquÃ­.
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

