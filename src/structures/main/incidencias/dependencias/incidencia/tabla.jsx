'use client';

import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaEdit, FaTrash, FaRegFilePdf, FaCommentDots, FaHammer } from "react-icons/fa";
import Swal from "sweetalert2";
import EditarIncidencia from "./editar";
import PDF from "./pdf";
import Chat from "./chat";
import Materiales from "./materiales";

export default function TablaIncidencias({ isCambios, setIsCambios, userData, incidencias: incidenciasProp }) {
    const [busqueda, setBusqueda] = useState("");
    const [incidenciaEditar, setIncidenciaEditar] = useState(null);
    const [incidenciaDetalle, setIncidenciaDetalle] = useState(null);
    const [incidenciaPDF, setIncidenciaPDF] = useState(null);
    const [incidenciaChat, setIncidenciaChat] = useState(null);
    const [incidenciaMateriales, setIncidenciaMateriales] = useState(null);
    const [incidencias, setIncidencias] = useState(incidenciasProp);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIncidencias(incidenciasProp);
    }, [incidenciasProp]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    const incidenciasFiltradas = useMemo(() => {
        return incidencias.filter((incidencia) => {
            const searchLower = busqueda.toLowerCase();
            const usuario = incidencia.usuario || {};
            const responsable = incidencia.responsable || {};
            return (
                incidencia.id.toLowerCase().includes(searchLower) ||
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

                const nuevasIncidencias = incidencias.filter((incidencia) => incidencia.id !== id);
                setIncidencias(nuevasIncidencias);
                setIsCambios(!isCambios);
            } catch (error) {
                console.error("Error eliminando incidencia:", error);
                Swal.fire("Error", "No se pudo eliminar, el documento ya fue tramitado.", "error");
            }
        }
    };

    const closeModal = () => {
        setIncidenciaEditar(null);
        setIncidenciaDetalle(null);
        setIncidenciaPDF(null);
        setIncidenciaChat(null);
        setIncidenciaMateriales(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

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
            ) : incidenciasFiltradas.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-8">
                    No se encontraron incidencias.
                </div>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Asunto</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Estado de solicitud </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Estado de reparación </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fecha Inicio</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidenciasFiltradas.map((incidencia) => (
                            <tr key={incidencia.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{incidencia.asunto}</td>
                                <td className="border border-gray-300 px-4 py-2">{incidencia.estado_solicitud}</td>
                                <td className="border border-gray-300 px-4 py-2">{incidencia.estado_reparacion}</td>
                                <td className="border border-gray-300 px-4 py-2">{incidencia.fecha_inicio}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center flex justify-center space-x-2">
                                    {["Administrador", "Archivista", "Operario", "Carrera Universitaria"].includes(userData.permiso) && (
                                        incidencia.estado_solicitud !== 'Documento Tramitado'
                                            || userData.permiso === 'Administrador'
                                            || userData.permiso === 'Archivista'
                                            || userData.permiso === 'Operario' ?
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => setIncidenciaEditar(incidencia)}
                                            >
                                                <FaEdit />
                                            </button>
                                            :
                                            ''
                                    )}
                                    {["Administrador", "Carrera Universitaria"].includes(userData.permiso) && (
                                        incidencia.estado_solicitud !== 'Documento Tramitado' ?
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleEliminar(incidencia.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                            :
                                            ''
                                    )}
                                    {["Administrador", "Archivista", "Operario", "Carrera Universitaria"].includes(userData.permiso) && (
                                        <button
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => setIncidenciaPDF(incidencia)}
                                        >
                                            <FaRegFilePdf />
                                        </button>
                                    )}
                                    {["Administrador", "Archivista", "Operario", "Carrera Universitaria"].includes(userData.permiso) && (
                                        <button
                                            className="text-yellow-500 hover:text-yellow-700"
                                            onClick={() => setIncidenciaChat(incidencia)}
                                        >
                                            <FaCommentDots />
                                        </button>
                                    )}
                                    {["Administrador", "Archivista"].includes(userData.permiso) && (
                                        <button
                                            className="text-yellow-600 hover:text-yellow-800"
                                            onClick={() => setIncidenciaMateriales(incidencia)}
                                        >
                                            <FaHammer />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modales */}
            {incidenciaEditar && (
                <Modal onClose={closeModal}>
                    <EditarIncidencia incidencia={incidenciaEditar} userData={userData} isCambios={isCambios} setIsCambios={setIsCambios} closeModal={closeModal} />
                </Modal>
            )}

            {incidenciaPDF && (
                <Modal onClose={closeModal}>
                    <PDF incidencia={incidenciaPDF} />
                </Modal>
            )}
            {incidenciaChat && (
                <Modal onClose={closeModal}>
                    <Chat incidencia={incidenciaChat} />
                </Modal>
            )}
            {incidenciaMateriales && (
                <Modal onClose={closeModal}>
                    <Materiales incidencia={incidenciaMateriales} userData={userData} isCambios={isCambios} setIsCambios={setIsCambios} closeModal={closeModal} />
                </Modal>
            )}
        </div>
    );
}

function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-white w-full max-w-screen-lg rounded-lg shadow-lg p-6 relative overflow-y-auto"
                style={{
                    maxHeight: "75vh", // Altura máxima para pantallas grandes
                    height: "85vh",    // Altura para móviles
                    overflowX: "hidden", // Deshabilita scroll horizontal
                    scrollbarWidth: "none", // Oculta el scroll (Firefox)
                }}
            >
                <style jsx>{`
            /* Ocultar scroll en navegadores WebKit */
            div::-webkit-scrollbar {
                display: none;
            }
        `}</style>
                {/* Botón de cierre */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Contenido dinámico */}
                {children}
            </div>
        </div>

    );
}
