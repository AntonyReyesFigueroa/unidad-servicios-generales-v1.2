'use client';

import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import EditarIncidencia from "./editar";
import DetalleIncidencia from "./detalle";

export default function TablaIncidencias({ isCambios, setIsCambios, userData, incidencias: incidenciasProp }) {
    const [busqueda, setBusqueda] = useState("");
    const [incidenciaEditar, setIncidenciaEditar] = useState(null);
    const [incidenciaDetalle, setIncidenciaDetalle] = useState(null);
    const [incidencias, setIncidencias] = useState(incidenciasProp); // Estado local de incidencias
    const [loading, setLoading] = useState(true);

    // Sincroniza las props con el estado local
    useEffect(() => {
        setIncidencias(incidenciasProp);
    }, [incidenciasProp]);

    // Simula la carga de datos al montar el componente
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    // Filtrado de incidencias
    const incidenciasFiltradas = useMemo(() => {
        return incidencias.filter((incidencia) => {
            const searchLower = busqueda.toLowerCase();
            const usuario = incidencia.usuario || {};
            const responsable = incidencia.responsable || {};
            return (
                incidencia.asunto.toLowerCase().includes(searchLower) ||
                incidencia.fecha_inicio.toLowerCase().includes(searchLower) ||
                incidencia.estado_solicitud.toLowerCase().includes(searchLower) ||
                usuario.nombre?.toLowerCase().includes(searchLower) ||
                usuario.dni?.toLowerCase().includes(searchLower) ||
                usuario.email?.toLowerCase().includes(searchLower) ||
                usuario.pertenencia?.toLowerCase().includes(searchLower) ||
                responsable.nombre?.toLowerCase().includes(searchLower) ||
                responsable.dni?.toLowerCase().includes(searchLower) ||
                responsable.email?.toLowerCase().includes(searchLower)
            );
        });
    }, [busqueda, incidencias]);

    // Función para eliminar incidencia
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás deshacer esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/incidencia/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar la incidencia.");

                Swal.fire("Eliminado", "La incidencia ha sido eliminada.", "success");

                // Actualiza el estado local para reflejar los cambios
                const nuevasIncidencias = incidencias.filter((incidencia) => incidencia.id !== id);
                setIncidencias(nuevasIncidencias);

                // Si es necesario, informa al padre sobre los cambios
                setIsCambios(!isCambios);
            } catch (error) {
                console.error("Error eliminando incidencia:", error);
                Swal.fire("Error", "No se pudo eliminar, el documento ya fue tramitado.", "error");
            }
        }
    };

    return (
        <div className="p-4">
            {/* Buscador */}
            <div className="mb-4 flex items-center">
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Buscar incidencias..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
            </div>

            {/* Contenido principal */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 text-lg">Cargando incidencias...</p>
                    </div>
                </div>
            ) : incidenciasFiltradas.length === 0 && loading ? (
                <div className="text-center text-gray-600 text-lg mt-8">
                    No se encontraron incidencias.
                </div>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Asunto</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fecha Inicio</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidenciasFiltradas.map((incidencia) => (
                            <tr
                                key={incidencia.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setIncidenciaDetalle(incidencia)}
                            >
                                <td className="border border-gray-300 px-4 py-2">{incidencia.asunto}</td>
                                <td className="border border-gray-300 px-4 py-2">{incidencia.estado_solicitud}</td>
                                <td className="border border-gray-300 px-4 py-2">{incidencia.fecha_inicio}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center flex justify-center space-x-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIncidenciaEditar(incidencia);
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEliminar(incidencia.id);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modales */}
            {incidenciaEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-[90%] max-w-4xl rounded-lg shadow-lg p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setIncidenciaEditar(null)}
                        >
                            ✕
                        </button>
                        <EditarIncidencia incidencia={incidenciaEditar} />
                    </div>
                </div>
            )}

            {incidenciaDetalle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-[90%] max-w-4xl rounded-lg shadow-lg p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setIncidenciaDetalle(null)}
                        >
                            ✕
                        </button>
                        <DetalleIncidencia incidencia={incidenciaDetalle} />
                    </div>
                </div>
            )}
        </div>
    );
}
