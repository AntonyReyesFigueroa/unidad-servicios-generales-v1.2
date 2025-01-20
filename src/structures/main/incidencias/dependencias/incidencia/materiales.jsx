'use client'
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Materiales({ incidencia, userData, isCambios, setIsCambios, closeModal }) {

    const [showAgregarMateriales, setShowAgregarMateriales] = useState(false);
    const [UpdateMateriales, setUpdateMateriales] = useState(false)

    const toggleAgregarMateriales = () => {
        setShowAgregarMateriales(!showAgregarMateriales);
    };

    const toggleAgregarMaterialesUpdate = () => {
        setUpdateMateriales(!UpdateMateriales);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
                Materiales de incidencia
            </h2>

            {incidencia.id_incidencia_material ? (
                <VerMateriales
                    incidencia={incidencia}
                    userData={userData}
                    isCambios={isCambios}
                    setIsCambios={setIsCambios}
                    closeModal={closeModal}
                />
            ) : (
                <div>Materiales aún sin asignar</div>
            )}

            {/* Botón para mostrar/ocultar el componente */}
            <div className="text-center mt-4">
                {
                    incidencia.id_incidencia_material ?
                        <button
                            onClick={toggleAgregarMaterialesUpdate}
                            className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold transition-all 
       ${showAgregarMateriales
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {showAgregarMateriales ? (
                                <>
                                    <FaMinus className="inline-block mr-2" />
                                    Ocultar Editar Materiales
                                </>
                            ) : (
                                <>
                                    <FaPlus className="inline-block mr-2" />
                                    Editar Materiales
                                </>
                            )}
                        </button>
                        :
                        <button
                            onClick={toggleAgregarMateriales}
                            className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold transition-all 
   ${showAgregarMateriales
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {showAgregarMateriales ? (
                                <>
                                    <FaMinus className="inline-block mr-2" />
                                    Ocultar Agregar Materiales
                                </>
                            ) : (
                                <>
                                    <FaPlus className="inline-block mr-2" />
                                    Agregar Materiales
                                </>
                            )}
                        </button>
                }
            </div>

            {/* Mostrar el componente AgregarMateriales si está activado */}
            {showAgregarMateriales && (
                <div className="mt-6">
                    <AgregarMateriales
                        incidencia={incidencia}
                        userData={userData}
                        isCambios={isCambios}
                        setIsCambios={setIsCambios}
                        closeModal={closeModal}
                    />
                </div>
            )}


            {UpdateMateriales && (
                <div className="mt-6">
                    <EditarMateriales
                        incidencia={incidencia}
                        userData={userData}
                        isCambios={isCambios}
                        setIsCambios={setIsCambios}
                        closeModal={closeModal}
                    />
                </div>
            )}

        </div>
    );
}


function AgregarMateriales({ incidencia, userData, isCambios, setIsCambios, closeModal }) {

    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Activa la carga
        fetch("/api/almacen")
            .then((response) => response.json())
            .then((data) => {
                setProductos(data.map((producto) => ({ ...producto, cantidad: null }))); // Cantidad inicial null
                setFilteredProductos(data.map((producto) => ({ ...producto, cantidad: null })));
            })
            .catch((error) => console.error("Error fetching productos:", error))
            .finally(() => setLoading(false)); // Desactiva la carga
    }, []);

    useEffect(() => {
        const filtered = productos.filter((producto) => {
            const matchesSearch =
                producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
                producto.orden_pedido.toLowerCase().includes(search.toLowerCase());
            const matchesCategoria =
                categoria === "" || producto.categoria === categoria;

            return matchesSearch && matchesCategoria;
        });

        setFilteredProductos(filtered);
    }, [search, categoria, productos]);

    const updateCart = (producto, cantidad) => {
        const updatedCart = cart.filter((item) => item.id !== producto.id); // Remueve el producto actual para actualizarlo
        if (cantidad > 0) {
            updatedCart.push({ ...producto, cantidad: Math.min(cantidad, producto.stock) }); // Agrega con la nueva cantidad
        }
        setCart(updatedCart);

        setProductos((prev) =>
            prev.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: Math.min(cantidad, producto.stock) }
                    : item
            )
        );
    };

    const totalPrecio = cart.reduce(
        (total, item) => total + item.cantidad * item.precio_unidad,
        0
    );

    const cartSummary = cart.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio_unidad: item.precio_unidad,
        subtotal: item.cantidad * item.precio_unidad,
        orden_pedido: item.orden_pedido,
    }));

    const resumenCompleto = {
        productos: cartSummary,
        total: totalPrecio.toFixed(2),
    };

    const handleAgregarMateriales = async () => {
        try {
            // Enviar materiales a la incidencia
            const response = await fetch(`/api/materiales/${incidencia.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resumenCompleto),
            });

            if (!response.ok) throw new Error("Error al agregar los materiales");

            const { id } = await response.json();

            // Actualizar la incidencia con el id_incidencia_material
            const patchResponse = await fetch(`/api/incidencia/${incidencia.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_incidencia_material: id }),
            });

            if (!patchResponse.ok) throw new Error("Error al actualizar la incidencia");

            Swal.fire({
                title: "Éxito",
                text: "Materiales agregados correctamente a la incidencia.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });

            // Actualiza los estados y cierra el modal
            setIsCambios(!isCambios);
            closeModal();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al agregar los materiales.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center my-6">
                    <p className="text-gray-600 italic animate-pulse">
                        Cargando productos...
                    </p>
                </div>
            ) : (
                <>
                    <div className="p-4 bg-white border rounded-lg shadow-sm mb-8">
                        <h2 className="text-xl font-bold mb-4">Lista de materiales agregados</h2>
                        {cart.length === 0 ? (
                            <p className="text-sm text-gray-600 italic">
                                No has agregado productos.
                            </p>
                        ) : (
                            <>
                                <ul className="space-y-2">
                                    {cart.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex justify-between items-center"
                                        >
                                            <p>
                                                {item.nombre} (x{item.cantidad}) - S/
                                                {item.cantidad * item.precio_unidad}
                                            </p>
                                            <button
                                                onClick={() => updateCart(item, 0)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t mt-4 pt-4">
                                    <p className="text-lg font-bold text-right">
                                        Total: S/{totalPrecio.toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-8 mb-8">
                        <button
                            onClick={handleAgregarMateriales}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                        >
                            Agregar materiales a incidencia
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Buscar por nombre u orden de pedido"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-3 border rounded-md shadow-sm flex-grow"
                        />
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="p-3 border rounded-md shadow-sm"
                        >
                            <option value="">Todas las categorías</option>
                            {[...new Set(productos.map((producto) => producto.categoria))].map(
                                (cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.id}
                                className="p-4 bg-white border rounded-lg shadow-sm"
                            >
                                <h2 className="text-lg font-bold">{producto.nombre}</h2>
                                <p className="text-sm text-gray-600">{producto.categoria}</p>
                                <p className="text-sm">Stock: {producto.stock}</p>
                                <p className="text-sm">Precio: S/{producto.precio_unidad}</p>
                                <p className="text-sm">Orden: {producto.orden_pedido}</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateCart(
                                                producto,
                                                Math.max(
                                                    (cart.find((item) => item.id === producto.id)
                                                        ?.cantidad || 0) - 1,
                                                    0
                                                )
                                            )
                                        }
                                        disabled={
                                            !cart.find((item) => item.id === producto.id) ||
                                            cart.find((item) => item.id === producto.id)?.cantidad <=
                                            0
                                        }
                                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="0"
                                        value={
                                            cart.find((item) => item.id === producto.id)?.cantidad ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateCart(
                                                producto,
                                                Math.min(parseFloat(e.target.value) || 0, producto.stock)
                                            )
                                        }
                                        className="w-32 text-center border rounded-md"
                                    />
                                    <button
                                        onClick={() =>
                                            updateCart(
                                                producto,
                                                (cart.find((item) => item.id === producto.id)
                                                    ?.cantidad || 0) + 1
                                            )
                                        }
                                        disabled={
                                            cart.find((item) => item.id === producto.id)?.cantidad >=
                                            producto.stock
                                        }
                                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </>
            )}
        </div>
    );

}

function VerMateriales({ incidencia, userData, isCambios, setIsCambios, closeModal }) {
    const [materiales, setMateriales] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verificar que `id_incidencia_material` esté presente
        if (!incidencia || !incidencia.id_incidencia_material) {
            setError('ID de incidencia no disponible.');
            setLoading(false);
            return;
        }

        // Hacer el fetch al endpoint
        const fetchMateriales = async () => {
            try {
                const response = await fetch(`/api/materiales/${incidencia.id_incidencia_material}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los materiales.');
                }
                const data = await response.json();
                setMateriales(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMateriales();
    }, [incidencia]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando materiales...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!materiales || !materiales.incidencia_material) {
        return <p className="text-center text-gray-500">No hay datos disponibles.</p>;
    }

    const { productos, total } = materiales.incidencia_material;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Presupuesto de Materiales</h2>
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-medium">
                    <tr>
                        <th className="px-4 py-2 border">Producto</th>
                        <th className="px-4 py-2 border">Cantidad</th>
                        <th className="px-4 py-2 border">Precio Unidad</th>
                        <th className="px-4 py-2 border">Subtotal</th>
                        <th className="px-4 py-2 border">Orden de Pedido</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {productos.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{producto.nombre}</td>
                            <td className="px-4 py-2 border text-center">{producto.cantidad}</td>
                            <td className="px-4 py-2 border text-right">
                                s/ {Number(producto.precio_unidad || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-2 border text-right">
                                s/ {producto.subtotal.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 border">{producto.orden_pedido}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 text-gray-700 font-medium">
                        <td className="px-4 py-2 border text-right" colSpan="3">
                            Total
                        </td>
                        <td className="px-4 py-2 border text-right">s/ {parseFloat(total).toFixed(2)}</td>
                        <td className="px-4 py-2 border"></td>
                    </tr>
                </tfoot>
            </table>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

function EditarMateriales({ incidencia, userData, isCambios, setIsCambios, closeModal }) {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch inicial para obtener productos y materiales asociados
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch productos disponibles
                const productosResponse = await fetch("/api/almacen");
                const productosData = await productosResponse.json();

                let initialCart = [];

                // Fetch materiales ya asociados a la incidencia
                if (incidencia.id_incidencia_material) {
                    const materialesResponse = await fetch(`/api/materiales/${incidencia.id_incidencia_material}`);
                    const materialesData = await materialesResponse.json();
                    initialCart = materialesData.incidencia_material.productos.map((producto) => ({
                        ...producto,
                    }));
                }

                // Sincronizar productos con el carrito inicial
                const syncedProductos = productosData.map((producto) => {
                    const cartItem = initialCart.find((item) => item.id === producto.id);
                    return { ...producto, cantidad: cartItem ? cartItem.cantidad : 0 };
                });

                setProductos(syncedProductos);
                setFilteredProductos(syncedProductos);
                setCart(initialCart);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [incidencia.id_incidencia_material]);

    // Filtrar productos dinámicamente
    useEffect(() => {
        const filtered = productos.filter((producto) => {
            const matchesSearch =
                producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
                producto.orden_pedido.toLowerCase().includes(search.toLowerCase());
            const matchesCategoria =
                categoria === "" || producto.categoria === categoria;

            return matchesSearch && matchesCategoria;
        });

        setFilteredProductos(filtered);
    }, [search, categoria, productos]);

    // Actualizar carrito
    const updateCart = (producto, cantidad) => {
        const updatedCart = cart.filter((item) => item.id !== producto.id);
        if (cantidad > 0) {
            updatedCart.push({ ...producto, cantidad: Math.min(cantidad, producto.stock) });
        }
        setCart(updatedCart);

        // Sincroniza con productos
        setProductos((prev) =>
            prev.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: Math.min(cantidad, producto.stock) }
                    : item
            )
        );
    };

    // Calcular el precio total del carrito
    const totalPrecio = cart.reduce(
        (total, item) => total + item.cantidad * item.precio_unidad,
        0
    );

    // Guardar cambios
    const handleGuardarCambios = async () => {
        try {
            const resumenCompleto = {
                productos: cart.map((item) => ({
                    id: item.id,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio_unidad: item.precio_unidad,
                    subtotal: item.cantidad * item.precio_unidad,
                    orden_pedido: item.orden_pedido,
                })),
                total: totalPrecio.toFixed(2),
            };

            const response = await fetch(`/api/materiales/${incidencia.id_incidencia_material}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resumenCompleto),
            });

            if (!response.ok) throw new Error("Error al guardar los cambios");

            Swal.fire({
                title: "Éxito",
                text: "Materiales actualizados correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });

            setIsCambios(!isCambios);
            closeModal();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar los cambios.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center my-6">
                    <p className="text-gray-600 italic animate-pulse">
                        Cargando productos...
                    </p>
                </div>
            ) : (
                <>
                    {/* Lista de materiales agregados */}
                    <div className="p-4 bg-white border rounded-lg shadow-sm mb-8">
                        <h2 className="text-xl font-bold mb-4">Lista de materiales agregados</h2>
                        {cart.length === 0 ? (
                            <p className="text-sm text-gray-600 italic">
                                No has agregado productos.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {cart.map((item) => (
                                    <li key={item.id} className="flex justify-between items-center">
                                        <p>
                                            {item.nombre} (x{item.cantidad}) - S/
                                            {item.cantidad * item.precio_unidad}
                                        </p>
                                        <button
                                            onClick={() => updateCart(item, 0)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={handleGuardarCambios}
                        className="mb-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                        Guardar Cambios
                    </button>

                    {/* Filtros */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Buscar por nombre u orden de pedido"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-3 border rounded-md shadow-sm flex-grow"
                        />
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="p-3 border rounded-md shadow-sm"
                        >
                            <option value="">Todas las categorías</option>
                            {[...new Set(productos.map((producto) => producto.categoria))].map(
                                (cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                )
                            )}
                        </select>
                    </div>


                    {/* Catálogo de productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.id}
                                className="p-4 bg-white border rounded-lg shadow-sm"
                            >
                                <h2 className="text-lg font-bold">{producto.nombre}</h2>
                                <p className="text-sm text-gray-600">{producto.categoria}</p>
                                <p className="text-sm">Stock: {producto.stock}</p>
                                <p className="text-sm">Precio: S/{producto.precio_unidad}</p>
                                <p className="text-sm">Orden: {producto.orden_pedido}</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateCart(
                                                producto,
                                                Math.max(
                                                    (cart.find((item) => item.id === producto.id)
                                                        ?.cantidad || 0) - 1,
                                                    0
                                                )
                                            )
                                        }
                                        className="px-3 py-1 bg-gray-200 rounded-md"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={
                                            cart.find((item) => item.id === producto.id)?.cantidad ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateCart(
                                                producto,
                                                Math.min(
                                                    parseFloat(e.target.value, 2) || 0,
                                                    producto.stock
                                                )
                                            )
                                        }
                                        className="w-20 text-center border rounded-md"
                                    />
                                    <button
                                        onClick={() =>
                                            updateCart(
                                                producto,
                                                (cart.find((item) => item.id === producto.id)
                                                    ?.cantidad || 0) + 1
                                            )
                                        }
                                        className="px-3 py-1 bg-gray-200 rounded-md"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


                </>
            )}
        </div>
    );
}

