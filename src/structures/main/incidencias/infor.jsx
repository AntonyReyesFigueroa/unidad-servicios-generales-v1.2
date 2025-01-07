'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Incidencias() {
    const router = useRouter();
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);

    useEffect(() => {
        const carrera = Cookies.get('carreraUniversitaria');
        if (carrera) {
            fetchIncidencias(carrera);
        }
    }, []);

    const fetchIncidencias = async (carreraUniversitaria) => {
        const apiUrl = `/api/incidencia/pertenencia/${carreraUniversitaria}`;
        try {
            setIsLoading(true);
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error('Error al obtener las incidencias');

            const data = await response.json();
            setIncidenciasData(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => setSelectedIncidencia(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Cargando incidencias...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Incidencias</h1>

            {/* Tabla */}
            <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border">Asunto</th>
                        <th className="py-2 px-4 border">Estado de Solicitud</th>
                        <th className="py-2 px-4 border">Estado de Reparación</th>
                        <th className="py-2 px-4 border">Fecha Inicio</th>
                    </tr>
                </thead>
                <tbody>
                    {incidenciasData.length > 0 ? (
                        incidenciasData.map((incidencia) => (
                            <tr
                                key={incidencia.id}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedIncidencia(incidencia)}
                            >
                                <td className="py-2 px-4 border">{incidencia.asunto}</td>
                                <td className="py-2 px-4 border">{incidencia.estado_solicitud}</td>
                                <td className="py-2 px-4 border">{incidencia.estado_reparacion}</td>
                                <td className="py-2 px-4 border">{incidencia.fecha_inicio}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                No hay incidencias.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Botón Atrás */}
            <div className="flex justify-start">
                <button
                    onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
                    className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Atrás
                </button>
            </div>

            {/* Modal */}
            {selectedIncidencia && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6">
                        {/* Título y Fecha */}
                        <h2 className="text-2xl font-bold mb-2">{selectedIncidencia.asunto}</h2>
                        <p className="text-sm text-gray-500 mb-4">{selectedIncidencia.fecha_inicio}</p>

                        {/* Mensaje */}
                        <div className="mb-6 border border-gray-300 rounded p-4 text-justify">
                            {selectedIncidencia.mensaje || 'Sin mensaje adicional'}
                        </div>

                        {/* Firma */}
                        <p className="font-semibold mt-4">Atentamente,</p>
                        <p>{selectedIncidencia.usuario.nombre}</p>
                        <p className="text-sm text-gray-500">{selectedIncidencia.usuario.cargo}</p>

                        {/* Estados */}
                        <p className="mt-6 text-justify">
                            Su solicitud actualmente está en el estado de{' '}
                            <strong>{selectedIncidencia.estado_solicitud}</strong>. El estado de reparación se encuentra
                            en <strong>{selectedIncidencia.estado_reparacion}</strong>.
                        </p>

                        {/* Botón Cerrar */}
                        <div className="mt-6 text-right">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
