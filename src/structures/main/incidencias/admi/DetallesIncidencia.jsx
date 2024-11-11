import React, { useState, useRef, useEffect } from 'react';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';

export default function DetallesIncidencia({ incidencia, onClose, carreraId, actualizarIncidencias, empleados }) {
    const [estadoSolicitud, setEstadoSolicitud] = useState(incidencia.estadoSolicitud);
    const [estadoReparacion, setEstadoReparacion] = useState(incidencia.estadoReparacion);
    const [responsable, setResponsable] = useState(incidencia.responsable);
    const [mensajeRespuesta, setMensajeRespuesta] = useState('');
    const [respuestas, setRespuestas] = useState(incidencia.respuesta || []);
    const chatEndRef = useRef(null);

    const estadoSolicitudOptions = ["Documento pendiente", "Documento recepcionado", "Documento tramitado", "Documento aceptado", "Documento denegado"];
    const estadoReparacionOptions = ["Pendiente", "En espera de materiales", "En proceso", "Terminado"];

    const handleUpdateField = async (field, value) => {
        try {
            const updatedIncidencia = {
                ...incidencia,
                [field]: value
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${carreraId}`, {
                method: 'GET'
            });

            if (!response.ok) throw new Error("No se pudo obtener los datos de la carrera");

            const carreraData = await response.json();
            const updatedIncidencias = carreraData.incidencia.map((inc) =>
                inc.id_incidencia === incidencia.id_incidencia ? updatedIncidencia : inc
            );

            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${carreraId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...carreraData,
                    incidencia: updatedIncidencias
                })
            });

            actualizarIncidencias(updatedIncidencia);
            Swal.fire('Actualizado', `El campo ${field} se actualizó correctamente`, 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al actualizar el campo', 'error');
        }
    };

    const handleSendMessage = async () => {
        if (!mensajeRespuesta) return;

        const nuevaRespuesta = {
            id: respuestas.length + 1,
            nombreUsuario: Cookie.get('nombre') || 'Usuario Anónimo',
            emailUsuario: Cookie.get('correo_auth') || 'usuario@example.com',
            cargoUsuario: Cookie.get('cargo') || 'Sin Cargo',
            mensajeRespuesta
        };

        try {
            const updatedRespuestas = [...respuestas, nuevaRespuesta];
            setRespuestas(updatedRespuestas);
            setMensajeRespuesta('');

            const updatedIncidencia = {
                ...incidencia,
                respuesta: updatedRespuestas
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${carreraId}`, {
                method: 'GET'
            });

            if (!response.ok) throw new Error("No se pudo obtener los datos de la carrera");

            const carreraData = await response.json();
            const updatedIncidencias = carreraData.incidencia.map((inc) =>
                inc.id_incidencia === incidencia.id_incidencia ? updatedIncidencia : inc
            );

            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${carreraId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...carreraData,
                    incidencia: updatedIncidencias
                })
            });

            actualizarIncidencias(updatedIncidencia);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el mensaje', 'error');
        }
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [respuestas]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Detalles de Incidencia</h2>
                <div className="space-y-2">
                    <p><strong>Fecha:</strong> {incidencia.fecha}</p>
                    <p><strong>Hora:</strong> {incidencia.hora}</p>
                    <p><strong>Asunto:</strong> {incidencia.asunto}</p>
                    <p><strong>Mensaje:</strong> {incidencia.mensaje}</p>

                    <label><strong>Estado de solicitud:</strong></label>
                    <select value={estadoSolicitud} onChange={(e) => {
                        setEstadoSolicitud(e.target.value);
                        handleUpdateField('estadoSolicitud', e.target.value);
                    }} className="border border-gray-300 rounded w-full py-2 px-4 mb-2">
                        {estadoSolicitudOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <label><strong>Estado de reparación:</strong></label>
                    <select value={estadoReparacion} onChange={(e) => {
                        setEstadoReparacion(e.target.value);
                        handleUpdateField('estadoReparacion', e.target.value);
                    }} className="border border-gray-300 rounded w-full py-2 px-4 mb-2">
                        {estadoReparacionOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <label><strong>Responsable:</strong></label>
                    <select value={responsable} onChange={(e) => {
                        setResponsable(e.target.value);
                        handleUpdateField('responsable', e.target.value);
                    }} className="border border-gray-300 rounded w-full py-2 px-4 mb-4">
                        <option value="">Seleccionar responsable</option>
                        {empleados.map((empleado, index) => (
                            <option key={index} value={`${empleado.nombres} - ${empleado.cargo} - ${empleado.email}`}>
                                {empleado.nombres} - {empleado.cargo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chat de Respuestas */}
                <h3 className="text-lg font-semibold mt-6">Chat de Respuestas</h3>
                <div className="border border-gray-300 rounded p-3 mb-4 h-64 overflow-y-auto">
                    {respuestas.length > 0 ? (
                        respuestas.map((resp) => (
                            <div key={resp.id} className="mb-3">
                                <p className="text-sm font-bold">
                                    {resp.nombreUsuario} ({resp.cargoUsuario}):
                                </p>
                                <p className="text-sm bg-gray-100 p-2 rounded-lg">{resp.mensajeRespuesta}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay respuestas aún.</p>
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                <div className="flex items-center mt-4">
                    <input
                        type="text"
                        placeholder="Escribe tu respuesta..."
                        value={mensajeRespuesta}
                        onChange={(e) => setMensajeRespuesta(e.target.value)}
                        className="border border-gray-300 rounded w-full py-2 px-4 mr-2"
                    />
                    <button onClick={handleSendMessage} className="bg-blue-700 text-white px-4 py-2 rounded">
                        Enviar
                    </button>
                </div>

                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded">
                    Regresar
                </button>
            </div>
        </div>
    );
}
