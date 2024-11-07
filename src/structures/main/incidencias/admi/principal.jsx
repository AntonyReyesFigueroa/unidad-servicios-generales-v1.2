"use client";

import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';
import BuscadorIncidencias from './BuscadorIncidencias';
import IncidenciasTable from './IncidenciasTable';
import DetallesIncidencia from './DetallesIncidencia';

export default function IncidenciasFacultad() {
    const [permiso, setPermiso] = useState(Cookie.get('permiso'));
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [filteredIncidencias, setFilteredIncidencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);
    const [empleados, setEmpleados] = useState([]); // Almacena empleados

    useEffect(() => {
        if (permiso === 'Archivista' || permiso === 'Administrador') {
            fetchIncidencias();
            fetchEmpleados(); // Cargar empleados
        } else {
            Swal.fire('Acceso denegado', 'Redirigiendo...', 'error');
            setTimeout(() => window.location.href = '/', 1500);
        }
    }, [permiso]);

    const fetchIncidencias = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS);
            const data = await response.json();
            const formattedData = data.map(carrera => ({
                ...carrera,
                incidencia: carrera.incidencia.map(inc => ({
                    ...inc,
                    carreraId: carrera.id,
                    carrera: carrera.carrera
                }))
            }));
            setIncidenciasData(formattedData);
            setFilteredIncidencias(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al obtener las incidencias:', error);
        }
    };

    const fetchEmpleados = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL_EMPLEADO);
            const data = await response.json();
            const filteredEmpleados = data
                .filter(emp => emp.cargo !== 'Administrador' && emp.cargo !== 'Archivista') // Excluye "Administrador" y "Archivista"
                .map(emp => ({
                    nombres: emp.nombres,
                    cargo: emp.cargo,
                }));
            setEmpleados(filteredEmpleados);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    const handleSearch = (query, fechaDesde = '', fechaHasta = '') => {
        const normalizedQuery = query.toLowerCase();
        const fechaInicio = fechaDesde ? new Date(fechaDesde) : null;
        const fechaFin = fechaHasta ? new Date(fechaHasta) : null;

        const filtered = incidenciasData.map(carrera => ({
            ...carrera,
            incidencia: carrera.incidencia.filter(incidencia => {
                const incidenciaFecha = new Date(incidencia.fecha.split('/').reverse().join('-'));

                const matchesQuery =
                    incidencia.carrera.toLowerCase().includes(normalizedQuery) ||
                    incidencia.asunto.toLowerCase().includes(normalizedQuery) ||
                    incidencia.responsable.toLowerCase().includes(normalizedQuery);

                const matchesDateRange =
                    (!fechaInicio || incidenciaFecha >= fechaInicio) &&
                    (!fechaFin || incidenciaFecha <= fechaFin);

                return matchesQuery && matchesDateRange;
            })
        })).filter(carrera => carrera.incidencia.length > 0);

        setFilteredIncidencias(filtered);
    };

    const handleMostrarDetalles = (incidencia) => {
        setSelectedIncidencia(incidencia);
    };

    const handleCloseDetalles = () => {
        setSelectedIncidencia(null);
    };

    const actualizarIncidencias = async (updatedIncidencia) => {
        try {
            const carreraId = updatedIncidencia.carreraId;
            const carreraData = incidenciasData.find(carrera => carrera.id === carreraId);

            if (!carreraData) return;

            const updatedIncidencias = carreraData.incidencia.map(inc =>
                inc.id_incidencia === updatedIncidencia.id_incidencia ? updatedIncidencia : inc
            );

            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${carreraId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...carreraData,
                    incidencia: updatedIncidencias
                })
            });

            const newIncidenciasData = incidenciasData.map(carrera =>
                carrera.id === carreraId ? { ...carrera, incidencia: updatedIncidencias } : carrera
            );

            setIncidenciasData(newIncidenciasData);
            setFilteredIncidencias(newIncidenciasData);
            Swal.fire('Actualizado', 'Incidencia actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar la incidencia:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar la incidencia', 'error');
        }
    };

    if (isLoading) return <div className="text-center p-5">Cargando...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Solicitudes a Servicios Generales</h1>
            <BuscadorIncidencias onSearch={handleSearch} />
            <IncidenciasTable
                incidenciasData={filteredIncidencias}
                onMostrarDetalles={handleMostrarDetalles}
            />
            {selectedIncidencia && (
                <DetallesIncidencia
                    incidencia={selectedIncidencia}
                    onClose={handleCloseDetalles}
                    carreraId={selectedIncidencia.carreraId}
                    actualizarIncidencias={actualizarIncidencias}
                    empleados={empleados} // Pasamos los empleados filtrados
                />
            )}
        </div>
    );
}
