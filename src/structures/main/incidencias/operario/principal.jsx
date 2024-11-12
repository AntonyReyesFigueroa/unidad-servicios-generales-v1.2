'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import DetallesIncidencia from './DetallesIncidencia';

export default function IncidenciasOperario() {
    const [correoAuth, setCorreoAuth] = useState(null);
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [filteredIncidencias, setFilteredIncidencias] = useState([]);
    const [displayedIncidencias, setDisplayedIncidencias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);

    // Obtener el valor de la cookie 'correo_auth'
    useEffect(() => {
        const correo = Cookies.get('correo_auth');
        setCorreoAuth(correo);
    }, []);

    // Cargar las incidencias cuando se obtenga el correo
    useEffect(() => {
        if (correoAuth) {
            fetchIncidencias();
        }
    }, [correoAuth]);

    // Detectar la tecla 'Esc' para cerrar el modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleCloseDetalles();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const fetchIncidencias = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS);
            if (!response.ok) throw new Error('Error al obtener incidencias');
            const data = await response.json();

            const allIncidencias = data.flatMap(carrera => carrera.incidencia);
            const incidenciasFiltradas = allIncidencias.filter((incidencia) => {
                const partesResponsable = incidencia.responsable.split(' - ');
                const correoResponsable = partesResponsable[2] ? partesResponsable[2].trim() : '';
                return correoResponsable === correoAuth;
            });

            setIncidenciasData(allIncidencias);
            setFilteredIncidencias(incidenciasFiltradas);
            setDisplayedIncidencias(incidenciasFiltradas);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron cargar las incidencias', 'error');
        }
    };

    // Búsqueda en tiempo real
    useEffect(() => {
        const normalizedQuery = searchQuery.toLowerCase();
        const filtered = displayedIncidencias.filter((incidencia) =>
            incidencia.asunto.toLowerCase().includes(normalizedQuery) ||
            incidencia.estadoSolicitud.toLowerCase().includes(normalizedQuery) ||
            incidencia.estadoReparacion.toLowerCase().includes(normalizedQuery) ||
            incidencia.responsable.toLowerCase().includes(normalizedQuery)
        );
        setFilteredIncidencias(filtered);
    }, [searchQuery, displayedIncidencias]);

    const handleDateFilter = () => {
        const fechaInicio = fechaDesde ? new Date(fechaDesde) : null;
        const fechaFin = fechaHasta ? new Date(fechaHasta) : null;

        const filteredByDate = displayedIncidencias.filter((incidencia) => {
            const incidenciaFecha = new Date(incidencia.fecha.split('/').reverse().join('-'));
            return (
                (!fechaInicio || incidenciaFecha >= fechaInicio) &&
                (!fechaFin || incidenciaFecha <= fechaFin)
            );
        });

        setFilteredIncidencias(filteredByDate);
    };

    const handleMostrarDetalles = (incidencia) => {
        setSelectedIncidencia(incidencia);
    };

    const handleCloseDetalles = () => {
        setSelectedIncidencia(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Incidencias - Operario</h1>

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
                <button onClick={handleDateFilter} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Filtrar por Fecha
                </button>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4">Carrera</th>
                        <th className="py-2 px-4">Asunto</th>
                        <th className="py-2 px-4">Estado de Solicitud</th>
                        <th className="py-2 px-4">Estado de Reparación</th>
                        <th className="py-2 px-4">Responsable</th>
                        <th className="py-2 px-4">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIncidencias.length > 0 ? (
                        filteredIncidencias.map((incidencia) => (
                            <tr
                                key={incidencia.id_incidencia}
                                onClick={() => handleMostrarDetalles(incidencia)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="py-2 px-4">{incidencia.carrera}</td>
                                <td className="py-2 px-4">{incidencia.asunto}</td>
                                <td className="py-2 px-4">{incidencia.estadoSolicitud}</td>
                                <td className="py-2 px-4">{incidencia.estadoReparacion}</td>
                                <td className="py-2 px-4">{incidencia.responsable}</td>
                                <td className="py-2 px-4">{incidencia.fecha}</td>
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

            {selectedIncidencia && (
                <DetallesIncidencia
                    incidencia={selectedIncidencia}
                    onClose={handleCloseDetalles}
                    actualizarIncidencias={(updatedIncidencia) => {
                        const updatedList = incidenciasData.map(inc =>
                            inc.id_incidencia === updatedIncidencia.id_incidencia ? updatedIncidencia : inc
                        );
                        setIncidenciasData(updatedList);
                        setFilteredIncidencias(updatedList);
                        setDisplayedIncidencias(updatedList);
                    }}
                />
            )}
        </div>
    );
}
