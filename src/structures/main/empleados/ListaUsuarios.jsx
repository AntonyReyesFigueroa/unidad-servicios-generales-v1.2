'use client'

import React, { useEffect, useState } from 'react';
import Usuario from '@/structures/main/empleados/Usuario';

export default function ListaUsuarios({ isUploadUser }) {
  const [empleados, setEmpleados] = useState([]);

  // Función para obtener los empleados desde la API
  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLEADO}`);
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // UseEffect para cargar los empleados al inicio y cuando cambie isUploadUser
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmpleados();
    },2000); // 1 segundo de retraso

    // Limpia el timeout si el componente se desmonta o si isUploadUser cambia antes de que se complete
    return () => clearTimeout(timeoutId);
  }, [isUploadUser]);

  // Función para eliminar un empleado por ID
  const eliminarEmpleado = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLEADO}/${id}`, {
        method: 'DELETE',
      });
      fetchEmpleados(); // Actualiza la lista de empleados
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
    }
  };

  // UseEffect para cargar los empleados al inicio
  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Lista de Empleados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {empleados.map((empleado) => (
          <Usuario key={empleado.id} empleado={empleado} onEliminar={eliminarEmpleado} />
        ))}
      </div>
    </div>
  );
}
