'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa';

export default function CrearIncidencia({ isCambios, setIsCambios, userData }) {
    const [isOpen, setIsOpen] = useState(false); // Para controlar el modal
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejar el evento de teclado para cerrar el modal con ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleEnviar = async () => {
        if (!asunto || !mensaje) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos antes de enviar.',
                confirmButtonText: 'Entendido',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/incidencia/usuario/${userData.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asunto, mensaje }),
            });

            if (!response.ok) {
                throw new Error('No se pudo enviar la incidencia.');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Incidencia creada con éxito.',
                confirmButtonText: 'Aceptar',
            });

            setAsunto('');
            setMensaje('');
            setIsOpen(false);
            setIsCambios(!isCambios); // Notificar cambios
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear la incidencia.',
                confirmButtonText: 'Aceptar',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* Botón para abrir el modal */}
            <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition-all"
                onClick={() => setIsOpen(true)}
            >
                <FaPlus className="text-white" />
                Nueva Incidencia
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-[90%] max-w-2xl rounded-lg shadow-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Crear Nueva Incidencia
                            </h2>
                            <form>
                                {/* Campo de Asunto */}
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                                    placeholder="Escribe el asunto"
                                    value={asunto}
                                    onChange={(e) => setAsunto(e.target.value)}
                                />

                                {/* Campo de Mensaje */}
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Mensaje
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                                    rows="6"
                                    placeholder="Escribe el mensaje"
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                ></textarea>

                                {/* Firma automática */}
                                <div className="mt-4">
                                    <p className="text-gray-500 text-sm">
                                        Atentamente,
                                        <br />
                                        <span className="font-bold">{userData.nombre}</span>
                                        <br />
                                        <span className="italic">{userData.cargo}</span>
                                    </p>
                                </div>

                                {/* Botones */}
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        onClick={handleEnviar}
                                        disabled={loading}
                                    >
                                        {loading ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
