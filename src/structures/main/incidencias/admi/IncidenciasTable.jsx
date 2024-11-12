import React, { useEffect } from 'react';

export default function IncidenciasTable({ incidenciasData, onMostrarDetalles }) {

    // Detectar la tecla 'Esc' para cerrar el modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onMostrarDetalles(null);
            }
        };

        // Agregar el listener al documento
        document.addEventListener('keydown', handleEsc);

        // Limpiar el listener al desmontar
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onMostrarDetalles]);

    return (
        <div className="mt-4">
            <table className="min-w-full bg-white">
                <thead className="bg-blue-800 text-white">
                    <tr>
                        <th className="w-1/4 py-3 px-4">Carrera</th>
                        <th className="w-1/4 py-3 px-4">Asunto</th>
                        <th className="w-1/4 py-3 px-4">Fecha</th>
                        <th className="w-1/4 py-3 px-4">Responsable</th>
                    </tr>
                </thead>
                <tbody>
                    {incidenciasData && incidenciasData.length > 0 ? (
                        incidenciasData.flatMap(carrera =>
                            carrera.incidencia.map((incidencia) => (
                                <tr
                                    key={incidencia.id_incidencia}
                                    className="border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onMostrarDetalles(incidencia)}
                                >
                                    <td className="py-3 px-4">{carrera.carrera}</td>
                                    <td className="py-3 px-4 truncate">{incidencia.asunto}</td>
                                    <td className="py-3 px-4">{incidencia.fecha}</td>
                                    <td className="py-3 px-4">{incidencia.responsable}</td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">
                                No se encontraron incidencias
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
