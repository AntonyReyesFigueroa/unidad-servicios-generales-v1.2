'use client';
import React, { useEffect, useState } from 'react';
import HeaderPC from '@/structures/header/header-pc';
import HeaderMovil from './header-movil';
import Cookie from 'js-cookie';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function HeaderPage() {
  const { user, error, isLoading } = useUser();
  const [facultadData, setFacultadData] = useState([]);
  const [empleadoData, setEmpleadoData] = useState([]);
  const [permiso, setPermiso] = useState('visitante');

  const setCookie = (name, value) => {
    Cookie.set(name, value, { expires: 30 }); // Cookie expira en 30 días
  };

  const getCookie = (name) => {
    return Cookie.get(name);
  };

  useEffect(() => {
    if (user?.email) {
      // Configura la cookie 'correo_auth' con el correo del usuario
      setCookie('correo_auth', user.email);

      // Llama a las APIs y guarda los datos en los estados correspondientes
      const fetchFacultad = async () => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_FACULTAD);
          const data = await response.json();
          setFacultadData(data);
        } catch (error) {
          console.error('Error al obtener datos de facultad:', error);
        }
      };

      const fetchEmpleado = async () => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_URL_EMPLEADO);
          const data = await response.json();
          setEmpleadoData(data);
        } catch (error) {
          console.error('Error al obtener datos de empleado:', error);
        }
      };

      fetchFacultad();
      fetchEmpleado();
    }

    if (user?.name) {
      setCookie('nombre', user.name);
    }

    // Petición para verificar `idfacultad`
    const verifyFacultadId = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_INCIDENCIAS);
        const data = await response.json();
        const facultadCookie = getCookie('facultad');

        // Verificar si alguna carrera en la API coincide con el valor de la cookie `facultad`
        const carreraExistente = data.find(item => item.carrera === facultadCookie);

        if (carreraExistente) {
          // Si existe coincidencia, guardar `id` en la cookie `idfacultad`
          setCookie('idfacultad', carreraExistente.id);
        } else {
          // Si no hay coincidencia, establecer `idfacultad` en "false"
          setCookie('idfacultad', 'false');
        }
      } catch (error) {
        console.error('Error al verificar id de facultad:', error);
      }
    };

    verifyFacultadId();
  }, [user]);

  useEffect(() => {
    const correoAuth = getCookie('correo_auth');
    let foundPermiso = 'visitante';
    let cargo = 'Desconocido';

    // Comprueba el correo en facultadData
    const facultadMatch = facultadData.find((item) => item.email === correoAuth);
    if (facultadMatch) {
      foundPermiso = facultadMatch.permiso;
      setCookie('permiso', foundPermiso);
      setCookie('cargo', facultadMatch.cargo);

      // Si el permiso es "lectura" o "escritura", guarda la facultad en una cookie
      if (foundPermiso === "lectura" || foundPermiso === "escritura") {
        setCookie('facultad', facultadMatch.facultad);
      }
    } else {
      // Si no coincide en facultad, comprueba en empleadoData
      const empleadoMatch = empleadoData.find((item) => item.email === correoAuth);
      if (empleadoMatch) {
        foundPermiso = empleadoMatch.permiso;
        setCookie('permiso', foundPermiso);
        setCookie('cargo', empleadoMatch.cargo);
      } else {
        // Asignación de 'visitante' si no hay coincidencias
        setCookie('permiso', foundPermiso);
      }
    }

    // Actualiza el estado del permiso
    setPermiso(foundPermiso);
  }, [facultadData, empleadoData]);

  useEffect(() => {
    // Muestra en consola los valores de las cookies después de asignarlas
    // console.log('Permiso:', getCookie('permiso'));
    // console.log('Facultad:', getCookie('facultad'));
    // console.log('idfacultad:', getCookie('idfacultad')); // Verificar valor de `idfacultad`
  }, [permiso]);

  return (
    <div>
      <div style={{ width: 'auto', height: '61px' }}>
        <HeaderPC />
        <HeaderMovil />
      </div>
    </div>
  );
}
