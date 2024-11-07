import React, { useState, useEffect } from 'react';

export default function ModalCrearIncidencia({ onClose, onSubmit, editMode, incidencia }) {
    const [asunto, setAsunto] = useState(incidencia ? incidencia.asunto : '');
    const [mensaje, setMensaje] = useState(incidencia ? incidencia.mensaje : '');

    useEffect(() => {
        if (incidencia) {
            setAsunto(incidencia.asunto);
            setMensaje(incidencia.mensaje);
        }
    }, [incidencia]);

    const handleSubmit = () => {
        onSubmit(asunto, mensaje);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">
                    {editMode ? 'Editar Solicitud' : 'Añadir Nueva Solicitud'}
                </h2>
                <input
                    type="text"
                    placeholder="Asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
                />
                <textarea
                    placeholder="Mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
                />
                <div className="flex justify-end">
                    <button onClick={handleSubmit} className="bg-blue-700 text-white px-4 py-2 rounded mr-2">
                        {editMode ? 'Guardar Cambios' : 'Enviar'}
                    </button>
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
