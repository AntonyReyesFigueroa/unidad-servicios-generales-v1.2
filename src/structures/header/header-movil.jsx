'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { BtnCerrarSección } from './cerrar-sesion';

export default function HeaderMovil() {
  const [isOpen, setIsOpen] = useState(false);
  const [permiso, setPermiso] = useState('');

  // Obtener el valor de la cookie "permiso" con un intervalo para detectar cambios
  useEffect(() => {
    const checkRole = () => {
      const role = Cookies.get('permiso');
      if (role && role !== permiso) {
        setPermiso(role);
      }
    };

    // Verificar la cookie cada 500ms
    const interval = setInterval(checkRole, 500);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [permiso]);

  // Función para renderizar enlaces según el permiso
  const renderLinks = () => {
    if (!permiso) {
      return <p className="text-center">Cargando permisos...</p>;
    }

    switch (permiso) {
      case 'Administrador':
        return (
          <>
            <Link href="/incidencias/admi" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
              Incidencias Admi
            </Link>
            <Link href="/almacen" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
              Almacén
            </Link>
            <Link href="/empleados" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
              Empleados
            </Link>
            <Link href="/facultades" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
              Facultades
            </Link>
          </>
        );
      case 'Operario':
        return (
          <Link href="/incidencias/operario" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
            Incidencias Operario
          </Link>
        );
      case 'Archivista':
        return (
          <Link href="/incidencias/admi" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
            Incidencias Admi
          </Link>
        );
      case 'escritura':
      case 'lectura':
        return (
          <Link href="/incidencias/facultad" className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100">
            Incidencias Facultad
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className='headerMovil'>
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <h3 className="text-lg font-bold text-gray-800 uppercase">
            <Link href='/'>UNIDAD DE SERVICIOS GENERALES</Link>
          </h3>
        </div>

        {/* Botón menú hamburguesa */}
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>

        {/* Menú desplegable */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-50">
            <nav className="flex flex-col items-start p-4">
              {renderLinks()}
              <BtnCerrarSección />
            </nav>
          </div>
        )}
      </header>

      {/* Espacio para evitar que el contenido suba debajo del header */}
      <div className="h-16"></div>
    </div>
  );
}
