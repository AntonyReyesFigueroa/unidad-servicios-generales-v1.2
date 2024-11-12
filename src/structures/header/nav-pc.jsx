'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export const NavPC = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Función para obtener el valor de la cookie
        const checkRole = () => {
            const role = Cookies.get('permiso');
            if (role && role !== userRole) {
                setUserRole(role);
            }
        };

        // Revisar la cookie cada 500 ms para detectar cambios
        const interval = setInterval(checkRole, 500);

        // Limpiar el intervalo cuando se desmonte el componente
        return () => clearInterval(interval);
    }, [userRole]);

    if (!userRole) {
        return <p className="text-center">Cargando permisos...</p>;
    }

    return (
        <ul className='ul__nav_header'>
            {userRole === 'Administrador' && (
                <>
                    <li className='li__nav_header'>
                        <Link href="/incidencias/admi">Dependencias</Link>
                    </li>
                    <li className='li__nav_header'>
                        <Link href="/almacen">Almacén</Link>
                    </li>
                    <li className='li__nav_header'>
                        <Link href="/empleados">Empleados</Link>
                    </li>
                    <li className='li__nav_header'>
                        <Link href="/facultades">Facultades</Link>
                    </li>
                </>
            )}

            {userRole === 'Operario' && (
                <li className='li__nav_header'>
                    <Link href="/incidencias/operario">Dependencias</Link>
                </li>
            )}

            {userRole === 'Archivista' && (
                <li className='li__nav_header'>
                    <Link href="/incidencias/admi">Dependencias</Link>
                </li>
            )}

            {(userRole === 'escritura' || userRole === 'lectura') && (
                <li className='li__nav_header'>
                    <Link href="/incidencias/facultad">Dependencias</Link>
                </li>
            )}
        </ul>
    );
};

export default NavPC;
