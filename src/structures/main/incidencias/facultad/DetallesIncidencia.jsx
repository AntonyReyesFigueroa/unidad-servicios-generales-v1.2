import React, { useState, useRef, useEffect } from 'react';
import Cookie from 'js-cookie';

export default function DetallesIncidencia({ incidencia, onClose, idfacultad, actualizarIncidencias }) {
    const [mensajeRespuesta, setMensajeRespuesta] = useState('');
    const [respuestas, setRespuestas] = useState(incidencia.respuesta || []);
    const chatEndRef = useRef(null);

    // Colores para los usuarios, seleccionados con base en hash de nombreUsuario
    const coloresUsuarios = ['text-blue-900', 'text-green-700', 'text-purple-700', 'text-black-600'];

    const obtenerColorUsuario = (nombreUsuario) => {
        const hash = Array.from(nombreUsuario).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return coloresUsuarios[hash % coloresUsuarios.length];
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`);
            const data = await response.json();
            const updatedIncidencias = data.incidencia.map((inc) =>
                inc.id_incidencia === incidencia.id_incidencia ? updatedIncidencia : inc
            );

            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${idfacultad}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carrera: data.carrera, incidencia: updatedIncidencias })
            });

            actualizarIncidencias(updatedIncidencia);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
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
                    <p><strong>Estado de solicitud:</strong> {incidencia.estadoSolicitud}</p>
                    <p><strong>Estado de reparación:</strong> {incidencia.estadoReparacion}</p>
                    <p><strong>Responsable:</strong> {incidencia.responsable}</p>
                </div>

                <h3 className="text-lg font-semibold mt-6">Chat de Respuestas</h3>
                <div className="border border-gray-300 rounded p-3 mb-4 h-64 overflow-y-auto">
                    {respuestas.length > 0 ? (
                        respuestas.map((resp) => (
                            <div key={resp.id} className="mb-3">
                                <p className={`text-sm font-bold ${obtenerColorUsuario(resp.nombreUsuario)}`}>
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
