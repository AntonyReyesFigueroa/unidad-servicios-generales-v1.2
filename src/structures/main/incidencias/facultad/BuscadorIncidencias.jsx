"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function BuscadorIncidencias({ onSearch }) {
    const [query, setQuery] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const handleSearchByDate = () => {
        // Verifica si ambas fechas están llenas
        if (!fechaDesde || !fechaHasta) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, llena ambos campos de fecha para buscar por rango.',
            });
            return;
        }

        onSearch(query, fechaDesde, fechaHasta);
    };

    return (
        <div className="mb-4 flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
            <input
                type="text"
                placeholder="Buscar por asunto, mensaje, estadoSolicitud, estadoReparacion"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value, fechaDesde, fechaHasta); // Búsqueda en tiempo real para el texto
                }}
                className="border border-gray-300 rounded py-2 px-4 flex-grow md:w-auto w-full"
            />
            <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="border border-gray-300 rounded py-2 px-4 flex-grow md:w-auto w-full"
            />
            <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="border border-gray-300 rounded py-2 px-4 flex-grow md:w-auto w-full"
            />
            <button
                onClick={handleSearchByDate}
                className="bg-blue-700 text-white px-4 py-2 rounded md:w-auto w-full md:flex-shrink-0"
            >
                Buscar por Fecha
            </button>
        </div>
    );
}
