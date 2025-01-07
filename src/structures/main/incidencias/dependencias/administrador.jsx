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
        <div>
            <h1>Incidencias - {userData.pertenencia} </h1> //este es el titulo
            <CrearIncidencia setIsCambios={setIsCambios} isCambios={isCambios} userData={userData} />
            <h2>Tabla de incidencias</h2>
            <TablaIncidencias setIsCambios={setIsCambios} isCambios={isCambios} userData={userData} incidencias={incidencias} />

        </div>
    );
}
