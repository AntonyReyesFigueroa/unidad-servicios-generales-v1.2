'use client';

import React, { useEffect, useState } from 'react';
import CrearIncidencia from './incidencia/crear';
import TablaIncidencias from './incidencia/tabla';

export default function Administrador({ userData, url }) {
    const [incidencias, setIncidencias] = useState([]);
    const [isCambios, setIsCambios] = useState(true)

    useEffect(() => {
        const fetchIncidencias = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setIncidencias(data); // Guardar los datos en el estado
            } catch (error) {
                console.error('Error fetching incidencias:', error);
            }
        };

        if (url && userData) {
            fetchIncidencias();
        }
    }, [url, isCambios]); // Ejecutar el efecto cuando cambie la URL

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
                Incidencias - {userData.pertenencia}
            </h1>
            <CrearIncidencia setIsCambios={setIsCambios} isCambios={isCambios} userData={userData} />
            <h2 className="text-xl font-semibold text-gray-700">
                Tabla de incidencias
            </h2>
            <TablaIncidencias setIsCambios={setIsCambios} isCambios={isCambios} userData={userData} incidencias={incidencias} />
        </div>
    );
}
