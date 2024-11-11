import React, { useState, useRef, useEffect } from 'react';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';

export default function DetallesIncidencia({ incidencia, onClose, actualizarIncidencias }) {
    const [mensajeRespuesta, setMensajeRespuesta] = useState('');
    const [respuestas, setRespuestas] = useState(incidencia.respuesta || []);
    const chatEndRef = useRef(null);

    // Colores para los usuarios, seleccionados con base en hash de nombreUsuario
    const coloresUsuarios = ['text-blue-800', 'text-green-700', 'text-purple-700', 'text-red-600'];

    const obtenerColorUsuario = (nombreUsuario) => {
        const hash = Array.from(nombreUsuario).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return coloresUsuarios[hash % coloresUsuarios.length];
    };

    // Función para enviar un mensaje
    const handleSendMessage = async () => {
        if (!mensajeRespuesta.trim()) return;

        const nuevaRespuesta = {
            id: respuestas.length + 1,
            nombreUsuario: Cookie.get('nombre') || 'Usuario Anónimo',
            emailUsuario: Cookie.get('correo_auth') || 'usuario@example.com',
            cargoUsuario: Cookie.get('cargo') || 'Sin Cargo',
            mensajeRespuesta: mensajeRespuesta.trim()
        };

        try {
            const updatedRespuestas = [...respuestas, nuevaRespuesta];
            setRespuestas(updatedRespuestas);
            setMensajeRespuesta('');

            // Actualizar la incidencia en la API
            const response = await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${incidencia.carreraId}`);
            const data = await response.json();
            const updatedIncidencias = data.incidencia.map((inc) =>
                inc.id_incidencia === incidencia.id_incidencia
                    ? { ...inc, respuesta: updatedRespuestas }
                    : inc
            );

            await fetch(`${process.env.NEXT_PUBLIC_INCIDENCIAS}/${incidencia.carreraId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, incidencia: updatedIncidencias })
            });

            // Llamar al método para actualizar incidencias en el componente padre
            actualizarIncidencias({ ...incidencia, respuesta: updatedRespuestas });

            Swal.fire('Enviado', 'Tu respuesta ha sido enviada correctamente', 'success');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el mensaje', 'error');
        }
    };

    // Efecto para desplazar al final del chat automáticamente
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [respuestas]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="float-right text-red-500 font-bold mb-2">✖</button>
                <h2 className="text-2xl font-bold mb-4">Detalles de Incidencia</h2>

                <div className="space-y-4 mb-6">
                    <p><strong>Fecha:</strong> {incidencia.fecha}</p>
                    <p><strong>Asunto:</strong> {incidencia.asunto}</p>
                    <p><strong>Mensaje:</strong> {incidencia.mensaje}</p>
                </div>

                <h3 className="text-xl font-semibold mb-4">Chat de Respuestas</h3>
                <div className="border border-gray-300 rounded p-4 mb-4 h-64 overflow-y-auto">
                    {respuestas.map((resp, index) => (
                        <div key={index} className="mb-3">
                            <p className={`text-sm font-bold ${obtenerColorUsuario(resp.nombreUsuario)}`}>
                                {resp.nombreUsuario} ({resp.cargoUsuario}):
                            </p>
                            <p className="text-sm bg-gray-100 p-2 rounded-lg">{resp.mensajeRespuesta}</p>
                        </div>
                    ))}
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
            </div>
        </div>
    );
}
