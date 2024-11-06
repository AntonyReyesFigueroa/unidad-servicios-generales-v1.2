import React from 'react';

export default function IncidenciasTable({ incidenciasData, permiso, onEliminar, onEditar, onMostrarDetalles }) {
    return (
        <table className="min-w-full bg-white mt-4">
            <thead className="bg-blue-800 text-white">
                <tr>
                    <th className="w-1/4 py-3 px-4">Asunto</th>
                    <th className="w-1/4 py-3 px-4">Fecha</th>
                    {permiso === 'escritura' && (
                        <>
                            <th className="w-1/4 py-3 px-4">Editar</th>
                            <th className="w-1/4 py-3 px-4">Eliminar</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody>
                {incidenciasData && incidenciasData.length > 0 ? (
                    incidenciasData.map((incidencia) => (
                        <tr
                            key={incidencia.id_incidencia}
                            className="border-b hover:bg-gray-100 cursor-pointer"
                            onClick={() => onMostrarDetalles(incidencia)}
                        >
                            <td className="py-3 px-4 truncate">{incidencia.asunto}</td>
                            <td className="py-3 px-4">{incidencia.fecha}</td>
                            {permiso === 'escritura' && (
                                <>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditar(incidencia);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEliminar(incidencia.id_incidencia);
                                            }}
                                            className="text-red-600 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={permiso === 'escritura' ? 4 : 2} className="text-center py-4">
                            No se encontraron incidencias
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
