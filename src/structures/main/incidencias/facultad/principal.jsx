// IncidenciasFacultad.jsx

'use client';

import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';
import BuscadorIncidencias from './BuscadorIncidencias';
import IncidenciasTable from './IncidenciasTable';
import ModalCrearIncidencia from './ModalCrearIncidencia';
import DetallesIncidencia from './DetallesIncidencia';

export default function IncidenciasFacultad() {
    const [permiso, setPermiso] = useState(Cookie.get('permiso'));
    const [idfacultad, setIdfacultad] = useState(Cookie.get('idfacultad'));
    const [facultad, setFacultad] = useState(Cookie.get('facultad'));
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [filteredIncidencias, setFilteredIncidencias] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detalleModalVisible, setDetalleModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [incidenciaToEdit, setIncidenciaToEdit] = useState(null);
    const [incidenciaDetalle, setIncidenciaDetalle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (permiso === 'lectura' || permiso === 'escritura') {
            fetchIncidencias();
        } else {
            Swal.fire('Acceso denegado', 'Redirigiendo...', 'error');
            setTimeout(() => window.location.href = '/', 1500);
        }
    }, [permiso]);

    const fetchIncidencias = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS);
            const data = await response.json();
            const carreraExistente = data.find((item) => item.carrera === facultad);

            if (carreraExistente) {
                Cookie.set('idfacultad', carreraExistente.id, { expires: 30 });
                setIdfacultad(carreraExistente.id);
                setIncidenciasData(carreraExistente.incidencia);
                setFilteredIncidencias(carreraExistente.incidencia);
            } else {
                Cookie.remove('idfacultad');
                setIdfacultad(null);
                setIncidenciasData([]);
                setFilteredIncidencias([]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error al obtener las incidencias:', error);
        }
    };

    const handleAbrirModalAgregar = () => {
        setModalVisible(true);
        setEditMode(false);
        setIncidenciaToEdit(null);
    };

    const handleAgregarIncidencia = async (asunto, mensaje) => {
        const nuevaIncidencia = {
            id_incidencia: Date.now(),
            fecha: new Date().toLocaleDateString('en-GB'),
            hora: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            asunto,
            mensaje,
            estadoSolicitud: 'Documento pendiente',
            estadoReparacion: 'Pendiente',
            responsable: 'Sin responsable',
            email: Cookie.get('correo_auth'),
            cargo: Cookie.get('cargo'),
            materiales: [],
            respuesta: [],
        };

        if (!idfacultad) {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ carrera: facultad, incidencia: [nuevaIncidencia] }),
                });
                const newData = await response.json();
                Cookie.set('idfacultad', newData.id, { expires: 30 });
                setIdfacultad(newData.id);
                Swal.fire('Éxito', 'Nueva carrera y solicitud creadas exitosamente', 'success');
                fetchIncidencias();
            } catch (error) {
                console.error('Error al crear la carrera e incidencia:', error);
                Swal.fire('Error', 'Hubo un problema al crear la solicitud', 'error');
            }
        } else {
            try {
                const updatedIncidencias = [...incidenciasData, nuevaIncidencia];
                await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ carrera: facultad, incidencia: updatedIncidencias }),
                });
                Swal.fire('Éxito', 'Solicitud añadida exitosamente', 'success');
                setIncidenciasData(updatedIncidencias);
                setFilteredIncidencias(updatedIncidencias);
            } catch (error) {
                console.error('Error al agregar la incidencia:', error);
                Swal.fire('Error', 'Hubo un problema al agregar la solicitud', 'error');
            }
        }
        setModalVisible(false);
    };

    const handleEliminar = async (id_incidencia) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedIncidencias = incidenciasData.filter(incidencia => incidencia.id_incidencia !== id_incidencia);
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ carrera: facultad, incidencia: updatedIncidencias }),
                    });
                    Swal.fire('Eliminado', 'La incidencia ha sido eliminada', 'success');
                    setIncidenciasData(updatedIncidencias);
                    setFilteredIncidencias(updatedIncidencias);
                } catch (error) {
                    console.error('Error al eliminar la incidencia:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar la solicitud', 'error');
                }
            }
        });
    };

    const handleEditar = (incidencia) => {
        setEditMode(true);
        setIncidenciaToEdit(incidencia);
        setModalVisible(true);
    };

    const handleMostrarDetalles = async (incidencia) => {
        try {
            // Obtener los datos más recientes de la incidencia seleccionada
            const response = await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`);
            const data = await response.json();
            const incidenciaActualizada = data.incidencia.find((inc) => inc.id_incidencia === incidencia.id_incidencia);
            setIncidenciaDetalle(incidenciaActualizada);
            setDetalleModalVisible(true);
        } catch (error) {
            console.error("Error al obtener los detalles de la incidencia:", error);
            Swal.fire('Error', 'No se pudo cargar la incidencia seleccionada', 'error');
        }
    };

    const handleActualizarIncidencia = async (asunto, mensaje) => {
        const updatedIncidencias = incidenciasData.map((inc) =>
            inc.id_incidencia === incidenciaToEdit.id_incidencia ? { ...inc, asunto, mensaje } : inc
        );

        try {
            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carrera: facultad, incidencia: updatedIncidencias }),
            });
            Swal.fire('Actualizado', 'La incidencia ha sido actualizada', 'success');
            setIncidenciasData(updatedIncidencias);
            setFilteredIncidencias(updatedIncidencias);
        } catch (error) {
            console.error('Error al actualizar la incidencia:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar la solicitud', 'error');
        }

        setModalVisible(false);
        setEditMode(false);
        setIncidenciaToEdit(null);
    };

    const handleSearch = (query, fechaDesde = '', fechaHasta = '') => {
        const normalizedQuery = query.toLowerCase();
        let filtered = incidenciasData;

        if (fechaDesde && fechaHasta) {
            filtered = filtered.filter(incidencia => {
                const incidenciaFecha = new Date(incidencia.fecha.split('/').reverse().join('-'));
                const desde = new Date(fechaDesde);
                const hasta = new Date(fechaHasta);
                return incidenciaFecha >= desde && incidenciaFecha <= hasta;
            });
        }

        filtered = filtered.filter(incidencia =>
            incidencia.asunto.toLowerCase().includes(normalizedQuery) ||
            incidencia.mensaje.toLowerCase().includes(normalizedQuery) ||
            incidencia.estadoSolicitud.toLowerCase().includes(normalizedQuery) ||
            incidencia.estadoReparacion.toLowerCase().includes(normalizedQuery) ||
            incidencia.responsable.toLowerCase().includes(normalizedQuery)
        );

        setFilteredIncidencias(filtered);
    };

    const actualizarIncidenciaRespuesta = (incidenciaActualizada) => {
        const updatedIncidencias = incidenciasData.map(inc =>
            inc.id_incidencia === incidenciaActualizada.id_incidencia ? incidenciaActualizada : inc
        );
        setIncidenciasData(updatedIncidencias);
        setFilteredIncidencias(updatedIncidencias);
        setIncidenciaDetalle(incidenciaActualizada);
    };

    if (isLoading) return <div className="text-center p-5">Cargando...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Solicitudes a Servicios Generales</h1>
            {permiso === 'escritura' && (
                <button
                    onClick={handleAbrirModalAgregar}
                    className="bg-blue-700 text-white py-2 px-4 rounded mb-4"
                >
                    Añadir Solicitudes
                </button>
            )}
            <BuscadorIncidencias onSearch={handleSearch} />
            <IncidenciasTable
                incidenciasData={filteredIncidencias}
                permiso={permiso}
                onEliminar={handleEliminar}
                onEditar={handleEditar}
                onMostrarDetalles={handleMostrarDetalles}
            />
            {modalVisible && (
                <ModalCrearIncidencia
                    onClose={() => setModalVisible(false)}
                    onSubmit={editMode ? handleActualizarIncidencia : handleAgregarIncidencia}
                    editMode={editMode}
                    incidencia={incidenciaToEdit}
                />
            )}
            {detalleModalVisible && (
                <DetallesIncidencia
                    incidencia={incidenciaDetalle}
                    idfacultad={idfacultad}
                    onClose={() => setDetalleModalVisible(false)}
                    actualizarIncidencias={actualizarIncidenciaRespuesta}
                />
            )}
        </div>
    );
}
