'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FormularioEmpleado from './formulario-empleado';

const EditarEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [isUpdateForm, setIsUpdateForm] = useState(false)
  const [dataEmpleadoSelect, setDataEmpleadoSelect] = useState()




  useEffect(() => {
    // Obtener empleados desde la API
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL_EMPLEADO);
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    };

    fetchEmpleados();
  }, [selectedEmpleado]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLEADO}/${id}`, {
        method: 'DELETE',
      });
      setEmpleados(empleados.filter((empleado) => empleado.id !== id));
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
    }
  };

  const handleEdit = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.dni.includes(searchTerm) ||
    empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.permiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.fechaNacimiento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-5xl font-extrabold text-center mt-12 mb-12 text-black tracking-widest font-serif">
        Lista de empleados
      </h1>
      <form onSubmit={(e) => e.preventDefault()} className="flex justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Ingrese nombre, DNI, cargo o permiso"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-lg px-4 py-2 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 h-12"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition duration-300 ease-in-out h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {empleados.map((empleado) => (
    <div
      key={empleado.id}
      className="bg-gray-800 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-center text-center sm:text-left sm:justify-start">
        <div className="w-full flex justify-center sm:w-auto sm:block mb-2 sm:mb-0 m-auto">
          <Image
            src={empleado.img}
            alt={`Imagen de ${empleado.nombres}`}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-indigo-500"
          />
        </div>
        <div className="flex-1 p-4">
          <h3 className="text-xl font-semibold">{empleado.nombres}</h3>
          <p className="text-gray-300 break-words">{empleado.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">DNI: {empleado.dni}</p>
        <p className="text-gray-400">Cargo: {empleado.cargo}</p>
        <p className="text-gray-400">Permiso: {empleado.permiso}</p>
        <p className="text-gray-400">Teléfono: {empleado.telefono}</p>
        <p className="text-gray-400">Cumpleaños: {empleado.fechaNacimiento}</p>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          onClick={() => handleDelete(empleado.id)}
        >
          Eliminar
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => {
            handleEdit(empleado)
            setIsUpdateForm(true)
            setDataEmpleadoSelect(empleado)
          }}
        >
          Editar
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Modal */}
      {selectedEmpleado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center text-gray-800 shadow-xl w-full max-w-md relative">
            {/* Botón de cierre */}
            <button
              onClick={() => setSelectedEmpleado(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200"
            >
              ✕
            </button>

            {/* Modal */}
            {selectedEmpleado && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 overflow-y-auto">
                <div className="bg-gray-800 text-white rounded-lg p-6 flex flex-col items-center shadow-xl w-full max-w-full md:max-w-3xl relative max-h-[90vh] overflow-y-auto transform scale-x-60">
                  {/* Botón de cierre */}
                  <button
                    onClick={() => {
                      setSelectedEmpleado(null)
                      setIsUpdateForm(false)
                    }}
                    className="absolute top-2 right-2 text-white hover:text-gray-300 transition duration-200"
                  >
                    ✕
                  </button>

                  <h2 className="text-3xl font-bold mb-6">Editar empleado</h2>

                  {/* Componente FormularioEmpleado */}
                  <FormularioEmpleado
                    empleado={selectedEmpleado}
                    setSelectedEmpleado={setSelectedEmpleado}
                    setEmpleados={setEmpleados}
                    setIsUpdateForm={setIsUpdateForm}
                    isUpdateForm={isUpdateForm}
                    dataEmpleadoSelect={dataEmpleadoSelect}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default EditarEmpleado;
