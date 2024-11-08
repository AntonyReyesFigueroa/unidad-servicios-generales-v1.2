'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function Incidencias() {
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [filteredIncidencias, setFilteredIncidencias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const carreraUniversitaria = Cookies.get('carreraUniversitaria');

    // Obtener todas las incidencias de la API y filtrar por la carrera obtenida de la cookie
    const fetchIncidencias = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS);
            if (!response.ok) throw new Error('Error al obtener incidencias');
            const data = await response.json();

            const carreraData = data.find(carrera => carrera.carrera === carreraUniversitaria);

            if (carreraData) {
                setIncidenciasData(carreraData.incidencia);
                setFilteredIncidencias(carreraData.incidencia);
            } else {
                setIncidenciasData([]);
                setFilteredIncidencias([]);
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron cargar las incidencias', 'error');
        }
    };

    useEffect(() => {
        fetchIncidencias();
    }, []);

    // Función para buscar en la tabla por los campos especificados
    const handleSearch = () => {
        const normalizedQuery = searchQuery.toLowerCase();
        const fechaInicio = fechaDesde ? new Date(fechaDesde) : null;
        const fechaFin = fechaHasta ? new Date(fechaHasta) : null;

        const filtered = incidenciasData.filter((incidencia) => {
            const incidenciaFecha = new Date(incidencia.fecha.split('/').reverse().join('-'));
            const matchesQuery =
                incidencia.asunto.toLowerCase().includes(normalizedQuery) ||
                incidencia.estadoSolicitud.toLowerCase().includes(normalizedQuery) ||
                incidencia.estadoReparacion.toLowerCase().includes(normalizedQuery) ||
                incidencia.responsable.toLowerCase().includes(normalizedQuery);

            const matchesDateRange =
                (!fechaInicio || incidenciaFecha >= fechaInicio) &&
                (!fechaFin || incidenciaFecha <= fechaFin);

            return matchesQuery && matchesDateRange;
        });

        setFilteredIncidencias(filtered);
    };

    // Renderizar la tabla
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Incidencias - {carreraUniversitaria}</h1>

            {/* Buscador */}
            <div className="mb-4 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <input
                    type="text"
                    placeholder="Buscar por asunto, estado, responsable..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded py-2 px-4 flex-grow"
                />
                <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="border border-gray-300 rounded py-2 px-4"
                />
                <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="border border-gray-300 rounded py-2 px-4"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>

            {/* Tabla */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border">Carrera</th>
                        <th className="py-2 px-4 border">Asunto</th>
                        <th className="py-2 px-4 border">Estado de Solicitud</th>
                        <th className="py-2 px-4 border">Estado de Reparación</th>
                        <th className="py-2 px-4 border">Responsable</th>
                        <th className="py-2 px-4 border">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIncidencias.length > 0 ? (
                        filteredIncidencias.map((incidencia) => (
                            <tr key={incidencia.id_incidencia} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border">{incidencia.carrera}</td>
                                <td className="py-2 px-4 border">{incidencia.asunto}</td>
                                <td className="py-2 px-4 border">{incidencia.estadoSolicitud}</td>
                                <td className="py-2 px-4 border">{incidencia.estadoReparacion}</td>
                                <td className="py-2 px-4 border">{incidencia.responsable}</td>
                                <td className="py-2 px-4 border">{incidencia.fecha}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">
                                No se encontraron incidencias
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
