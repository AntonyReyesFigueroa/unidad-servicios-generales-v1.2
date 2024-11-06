'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Swal from 'sweetalert2';
import "@/style/main/incidencias/incidencias.css";

export default function Inicidencias() {
    const router = useRouter();
    const [carreraSeleccionada, setCarreraSeleccionada] = useState(Cookies.get('carreraUniversitaria') || '');

    const carreras = [
        "ADMINISTRACIÓN", "AGRONOMÍA", "BIOLOGÍA Y BIOTECNOLOGÍA", "CONTABILIDAD",
        "DERECHO", "ECONOMÍA", "EDUCACIÓN", "ENFERMERÍA",
        "INDUSTRIAS ALIMENTARIAS", "INGENIERÍA AMBIENTAL", "INGENIERÍA CIVIL",
        "INGENIERÍA DE MINAS", "INGENIERÍA DE SISTEMAS", "INGENIERÍA EN AGRONEGOCIOS",
        "INGENIERÍA FORESTAL", "INGENIERÍA GEOLÓGICA", "INGENIERÍA HIDRÁULICA",
        "INGENIERÍA SANITARIA", "INGENIERÍA ZOOTECNISTA", "MEDICINA HUMANA",
        "MEDICINA VETERINARIA", "OBSTETRICIA", "SOCIOLOGÍA", "TURISMO Y HOTELERÍA"
    ];

    const handleSelectChange = (e) => {
        setCarreraSeleccionada(e.target.value);
    };

    useEffect(() => {
        if (carreraSeleccionada) {
            Cookies.set('carreraUniversitaria', carreraSeleccionada, { expires: 30 });
        }
    }, [carreraSeleccionada]);

    const handleSubmit = () => {
        if (carreraSeleccionada) {
            router.push('/incidencias');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, seleccione una carrera universitaria',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="">
            {/* Header */}
            <header className="w-full bg-blue-800 text-white py-10 text-center ">
                <h1 className="text-5xl font-bold text-yellow-500">Sistema de Gestión de Servicios Generales</h1>
                <p className="text-slate-300 text-lg mt-4 max-w-3xl text-justify m-auto">
                    La Unidad de Servicios Generales de la Universidad Nacional de Cajamarca ahora cuenta con este sistema para gestionar eficientemente los requerimientos de mantenimiento.
                </p>
            </header>
            <h1 className="text-2xl font-bold text-blue-900 text-center pt-10">Busqueda de incidencias : </h1>
            {/* Contenedor para imagen y formulario */}
            <div className="flex flex-col md:flex-row items-center justify-center my-8 space-y-6 md:space-y-0 md:space-x-8 ">

                {/* Imagen */}
                <div className="flex-shrink-0">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/0/0a/ESCUDO_UNC.png"
                        alt="Escudo UNC"
                        width={120}
                        height={120}
                        className="rounded-md"
                    />
                </div>

                {/* Formulario */}
                <div className="bg-white p-10 shadow-2xl rounded-lg max-w-lg w-full">
                    <form className="text-center">
                        <label htmlFor='carrera' className='block text-lg font-medium text-blue-900 mb-4'>
                            Seleccionar carrera universitaria:
                        </label>

                        <div className="flex justify-center mb-6">
                            <select
                                id='carrera'
                                value={carreraSeleccionada}
                                onChange={handleSelectChange}
                                className='border border-gray-300 p-3 rounded-md w-4/5 md:w-3/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
                            >
                                <option value='' disabled>Selecciona una carrera</option>
                                {carreras.map((carrera, index) => (
                                    <option key={index} value={carrera}>
                                        {carrera}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className='bg-indigo-900 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-900 transition duration-200 shadow-lg'
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
