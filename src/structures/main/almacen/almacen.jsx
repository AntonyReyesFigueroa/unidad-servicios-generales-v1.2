'use client'
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/almacen");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchProductos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);; // Cierra el modal al presionar ESC
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpia el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Handle add or edit product
  const handleSaveProduct = async (producto) => {
    const url = editingProduct
      ? `/api/almacen/${editingProduct.id}`
      : "/api/almacen";
    const method = editingProduct ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        throw new Error("Error saving product");
      }

      const result = await response.json();

      if (editingProduct) {
        // Actualizar producto existente
        setProductos(
          productos.map((p) =>
            p.id === editingProduct.id ? { ...p, ...producto } : p
          )
        );
      } else {
        // Agregar nuevo producto
        setProductos([...productos, result]);
        fetchProductos()
      }

      Swal.fire({
        icon: "success",
        title: editingProduct ? "Producto actualizado" : "Producto creado",
        text: "El producto ha sido procesado correctamente.",
      });

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar el producto.",
      });
    }
  };


  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        await fetch(`/api/almacen/${id}`, { method: "DELETE" });
        setProductos(productos.filter((producto) => producto.id !== id));

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El producto fue eliminado correctamente.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto.",
      });
    }
  };

  // Filtered products

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre?.toLowerCase().includes(search.toLowerCase()) &&
      (!categoriaFilter || producto.categoria === categoriaFilter) ||
      producto.categoria?.toLowerCase().includes(search.toLowerCase()) &&
      (!categoriaFilter || producto.categoria === categoriaFilter) ||
      producto.categoria?.toLowerCase().includes(search.toLowerCase()) &&
      (!categoriaFilter || producto.categoria === categoriaFilter) ||
      producto.orden_pedido?.toLowerCase().includes(search.toLowerCase()) &&
      (!categoriaFilter || producto.categoria === categoriaFilter)
  );


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventario de Almacén</h1>

      {/* Search and Filter */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500"
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Gasfitero">Gasfitero</option>
          <option value="Electricista">Electricista</option>
          <option value="Soldadura">Soldadura</option>
          <option value="Carpintería">Carpintería</option>
          <option value="Mecanica fina">Mecánica fina</option>
          <option value="Albañilería">Albañilería</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> <span>Agregar Producto</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Precio Unidad</th>
              <th className="px-4 py-2">Orden de Pedido</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr key={producto.id} className="border-b">
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">{producto.categoria}</td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2">s/ {producto.precio_unidad}</td>
                <td className="px-4 py-2">{producto.orden_pedido}</td>
                <td className="px-4 py-2 flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditingProduct(producto);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteProduct(producto.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center py-4">Cargando productos...</div>}

      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          producto={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

function ProductModal({ producto, onClose, onSave }) {
  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [categoria, setCategoria] = useState(producto?.categoria || "");
  const [stock, setStock] = useState(producto?.stock || "");
  const [precio_unidad, setPrecioUnidad] = useState(producto?.precio_unidad || "");
  const [orden_pedido, setOrdenPedido] = useState(producto?.orden_pedido || "");

  const isValid = () =>
    nombre.length >= 3 &&
    categoria &&
    stock > 0;

  const handleSave = () => {
    if (!isValid()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor llena todos los campos correctamente.",
      });
      return;
    }

    onSave({
      nombre,
      categoria,
      stock: parseInt(stock, 10),
      precio_unidad: precio_unidad ? precio_unidad : 0,
      orden_pedido: orden_pedido && orden_pedido !== 'Sin orden de pedido' ? orden_pedido : 'Sin orden de pedido',
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {producto ? "Editar Producto" : "Agregar Producto"}
          </h2>

          <form>
            <label className="block mb-2 font-medium">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label className="block mb-2 font-medium">Categoría</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Gasfitero">Gasfitero</option>
              <option value="Electricista">Electricista</option>
              <option value="Soldadura">Soldadura</option>
              <option value="Carpintería">Carpintería</option>
              <option value="Mecanica fina">Mecánica fina</option>
              <option value="Albañilería">Albañilería</option>
            </select>

            <label className="block mb-2 font-medium">Stock</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <label className="block mb-2 font-medium">Precio Unidad</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={precio_unidad}
              onChange={(e) => setPrecioUnidad(e.target.value)}
            />

            <label className="block mb-2 font-medium">Orden de Pedido</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              value={orden_pedido}
              onChange={(e) => setOrdenPedido(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
