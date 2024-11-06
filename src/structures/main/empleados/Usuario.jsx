import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function Usuario({ empleado, onEliminar }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEliminar = () => {
    onEliminar(empleado.id);
    setShowConfirm(false);
  };

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {/* Tarjeta de empleado */}
      <div 
        className="relative group bg-white text-gray-800 rounded-lg shadow-md p-4 flex items-center hover:bg-indigo-200 transition-transform duration-300 transform hover:scale-105 cursor-pointer w-full"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center w-full">
          <Image
            src={empleado.img}
            alt={`Imagen de ${empleado.nombres}`}
            width={60}
            height={60}
            className="rounded-full mr-4 border border-gray-300"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold">{empleado.nombres}</h3>
            <p className="text-sm text-gray-500">{empleado.email}</p>
          </div>
          {/* Botón de eliminar */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="ml-2 text-red-500 hover:text-red-700 transition duration-200"
          >
            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
          </button>
        </div>
      </div>

      {/* Modal de información */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
        >
          <div className="relative bg-white rounded-lg p-6 flex flex-col items-center text-gray-800 shadow-xl w-72">
            {/* Botón de cerrar */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200"
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <Image
              src={empleado.img}
              alt={`Imagen de ${empleado.nombres}`}
              width={100}
              height={100}
              className="rounded-full mb-4 border-2 border-indigo-500"
            />
            <h3 className="text-lg font-semibold text-center">{empleado.nombres}</h3>
            <p className="mt-1 text-sm">Correo: <span className="text-indigo-500">{empleado.email}</span></p>
            <p className="text-sm">DNI: <span className="text-indigo-500">{empleado.dni}</span></p>
            <p className="text-sm">Cargo: <span className="text-indigo-500">{empleado.cargo}</span></p>
            <p className="text-sm">Permiso: <span className="text-indigo-500">{empleado.permiso}</span></p>
            <p className="text-sm">Teléfono: <span className="text-indigo-500">{empleado.telefono}</span></p>
            <p className="text-sm">Cumpleaños: <span className="text-indigo-500">{formatearFecha(empleado.fechaNacimiento)}</span></p>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
        >
          <div className="relative bg-white rounded-lg p-6 flex flex-col items-center text-gray-800 shadow-xl w-72">
            <h3 className="text-lg font-semibold text-center mb-4">¿Estás seguro de eliminar a {empleado.nombres}?</h3>
            <div className="flex justify-around w-full">
              <button 
                onClick={handleEliminar}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
