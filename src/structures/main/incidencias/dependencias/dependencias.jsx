'use client';
import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import Administrador from './administrador';
import Archivista from './archivista';
import CarreraUniversitaria from './carreraUniversitaria';
import Operario from './operario';

export default function Dependencias() {
    const [userData, setUserData] = useState(null); // Estado para almacenar la cookie
    const [url, setUrl] = useState('')

    useEffect(() => {
        // Obtener la cookie y establecerla en el estado
        const cookieData = Cookie.get('userData');
        if (cookieData) {
            const data = JSON.parse(cookieData)
            setUserData(data); // Parsear la cookie porque es un string JSON


            if (data) {
                let URL = '/api/incidencia';

                if (data?.permiso === 'Administrador' || data?.permiso === 'Archivista') {
                    URL = `/api/incidencia/permiso/${data?.permiso}`;
                } else if (data?.permiso === 'Operario') {
                    URL = `/api/incidencia/permiso/${data?.nombre}`;
                } else if (data?.permiso === 'Carrera Universitaria') {
                    URL = `/api/incidencia/permiso/${data?.pertenencia}`;
                }
                setUrl(URL)


            }
        }

    }, []);



    if (!userData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando incidencias...</p>
                </div>
            </div>
        )
    }

    // Renderizar el componente correspondiente según el permiso
    const { permiso } = userData;

    if (permiso === 'Administrador') return <Administrador userData={userData} url={url} />;
    if (permiso === 'Archivista') return <Archivista userData={userData} url={url} />;
    if (permiso === 'Operario') return <Operario userData={userData} url={url} />;
    if (permiso === 'Carrera Universitaria') return <CarreraUniversitaria userData={userData} url={url} />;

    // Si el permiso no coincide con ningún caso, renderizar un mensaje de error
    return <p>No tienes permisos válidos para acceder a esta sección.</p>;
}
