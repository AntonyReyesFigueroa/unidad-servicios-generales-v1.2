'use client'
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Usamos useRouter para la redirección

export default function Incidencias() {
    const [carrera, setCarrera] = useState('');
    const router = useRouter(); // Iniciamos el enrutador

    useEffect(() => {
        // Obtenemos la carrera guardada en la cookie
        const carreraGuardada = Cookies.get('carreraUniversitaria');
        if (carreraGuardada) {
            setCarrera(carreraGuardada);
        } else {
            // Si no se encuentra la carrera, redirigir al inicio
            router.push('/');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-10 shadow-lg rounded-lg max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">Incidencias</h1>
                <p className="text-lg text-gray-700">
                    Carrera seleccionada: <strong>{carrera}</strong>
                </p>
            </div>
        </div>
    );
}
