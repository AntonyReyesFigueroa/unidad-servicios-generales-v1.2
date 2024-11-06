'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import ComponentSubirImg from '@/components/subir-imagen';

const PersonalUNC = () => {
  const [personas, setPersonas] = useState([]);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [facultad, setFacultad] = useState('');
  const [cargo, setCargo] = useState('');
  const [permiso, setPermiso] = useState('');
  const [getUrlImage, setGetUrlImage] = useState('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725998380/empleados/qi8foyk50crirjaq7xgf.png');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_FACULTAD;

  // Fetch Personas
  const fetchPersonas = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setPersonas(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudo obtener los datos del personal de facultad', 'error');
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  // Agregar Persona
  const handleAddPersona = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || email.length < 5 || email.length > 50) {
      return Swal.fire('Error', 'Introduce un correo válido entre 5 y 50 caracteres', 'error');
    }
    if (nombre.length < 10 || nombre.length > 50) {
      return Swal.fire('Error', 'El nombre debe tener entre 10 y 50 caracteres', 'error');
    }
    if (!facultad) {
      return Swal.fire('Error', 'Debes seleccionar una facultad', 'error');
    }
    if (telefono.length < 9 || telefono.length > 12 || isNaN(telefono)) {
      return Swal.fire('Error', 'El teléfono debe tener entre 9 y 12 dígitos numéricos', 'error');
    }
    if (!cargo) {
      return Swal.fire('Error', 'Debes seleccionar un cargo', 'error');
    }

    const newPersona = {
      email,
      nombre,
      telefono,
      facultad,
      cargo,
      permiso,
      img: getUrlImage || 'https://res.cloudinary.com/dd8snmdx4/image/upload/v1725998380/empleados/qi8foyk50crirjaq7xgf.png',
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPersona),
      });

      if (response.ok) {
        Swal.fire('Personal agregado de facultad', '', 'success');
        fetchPersonas();
        setShowModal(false);
        clearForm();
      } else {
        Swal.fire('Error', 'No se pudo agregar al personal de facultad', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al agregar al personal de facultad', 'error');
    }
  };

  // Editar Persona
  const handleEditPersona = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || email.length < 5 || email.length > 50) {
      return Swal.fire('Error', 'Introduce un correo válido entre 5 y 50 caracteres', 'error');
    }
    if (nombre.length < 10 || nombre.length > 50) {
      return Swal.fire('Error', 'El nombre debe tener entre 10 y 50 caracteres', 'error');
    }
    if (!facultad) {
      return Swal.fire('Error', 'Debes seleccionar una facultad', 'error');
    }
    if (telefono.length < 9 || telefono.length > 12 || isNaN(telefono)) {
      return Swal.fire('Error', 'El teléfono debe tener entre 9 y 12 dígitos numéricos', 'error');
    }
    if (!cargo) {
      return Swal.fire('Error', 'Debes seleccionar un cargo', 'error');
    }

    const updatedPersona = {
      email,
      nombre,
      telefono,
      facultad,
      cargo,
      permiso,
      img: getUrlImage || currentPersona.img,
    };

    try {
      const response = await fetch(`${apiUrl}/${currentPersona.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPersona),
      });

      if (response.ok) {
        Swal.fire('Personal de facultad actualizado', '', 'success');
        fetchPersonas();
        setShowModal(false);
        clearForm();
      } else {
        Swal.fire('Error', 'No se pudo actualizar al personal de facultad', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al actualizar al personal de facultad', 'error');
    }
  };

  // Eliminar Persona
  const handleDeletePersona = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire('Personal de facultad eliminado', '', 'success');
          fetchPersonas();
        } else {
          Swal.fire('Error', 'No se pudo eliminar al personal de facultad', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error al eliminar al personal de facultad', 'error');
      }
    }
  };

  // Preparar para editar
  const handleEditClick = (persona) => {
    setEmail(persona.email);
    setNombre(persona.nombre);
    setTelefono(persona.telefono);
    setFacultad(persona.facultad);
    setCargo(persona.cargo);
    setPermiso(persona.permiso);
    setGetUrlImage(persona.img);
    setCurrentPersona(persona);
    setIsEditing(true);
    setShowModal(true);
  };

  const clearForm = () => {
    setEmail('');
    setNombre('');
    setTelefono('');
    setFacultad('');
    setCargo('');
    setPermiso('');
    setGetUrlImage('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725998380/empleados/qi8foyk50crirjaq7xgf.png');
    setCurrentPersona(null);
    setIsEditing(false);
  };

  const filteredPersonas = personas.filter((persona) =>
    persona.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.facultad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.permiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Agregar personal de la Universidad Nacional de Cajamarca</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
        >
          + Añadir Personal
        </button>
      </div>

      <div className="relative flex justify-center my-4 mb-10">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar personal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-2 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 h-12"
          />
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition duration-300 ease-in-out h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-h-20 bg-gray-50">
        <div className="pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 bg-cover bg-center" style={{ backgroundImage: "url('/tu-imagen-fondo-elegante.jpg')" }}>
          {filteredPersonas.map((persona) => (
            <div
              key={persona.id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out max-w-sm mx-auto"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold mt-4 text-center pb-5">{persona.facultad}</h3>
                <div className="flex justify-center items-center mb-5">
                  <Image
                    src={persona.img}
                    alt={persona.nombre}
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                </div>
                <p className="text-gray-600 text-justify">Nombre: {persona.nombre} </p>
                <p className="text-gray-600 text-justify">Cargo: {persona.cargo} </p>
                <p
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(persona.email);
                    Swal.fire('Correo copiado', persona.email, 'success');
                  }}
                >
                  {persona.email}
                </p>
                <p className="text-gray-600">Teléfono: {persona.telefono}</p>
              </div>
              <div className="flex justify-center space-x-4 ">
                <button
                  onClick={() => handleEditClick(persona)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePersona(persona.id)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>




      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 overflow-y-auto transition-opacity duration-300">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg space-y-6 h-auto max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-center">{isEditing ? 'Editar Personal' : 'Añadir Personal'}</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email que pertenezca a la UNC"
                value={email}
                maxLength="50"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Ingrese nombres y apellidos"
                value={nombre}
                maxLength="50"
                minLength="10"
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />

              <select
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona una facultad</option>
                {[
                  'ADMINISTRACIÓN', 'AGRONOMÍA', 'BIOLOGÍA Y BIOTECNOLOGÍA', 'CONTABILIDAD', 'DERECHO', 'ECONOMÍA',
                  'EDUCACIÓN', 'ENFERMERÍA', 'INDUSTRIAS ALIMENTARIAS', 'INGENIERÍA AMBIENTAL', 'INGENIERÍA CIVIL',
                  'INGENIERÍA DE MINAS', 'INGENIERÍA DE SISTEMAS', 'INGENIERÍA EN AGRONEGOCIOS', 'INGENIERÍA FORESTAL',
                  'INGENIERÍA GEOLÓGICA', 'INGENIERÍA HIDRÁULICA', 'INGENIERÍA SANITARIA', 'INGENIERÍA ZOOTECNISTA',
                  'MEDICINA HUMANA', 'MEDICINA VETERINARIA', 'OBSTETRICIA', 'SOCIOLOGÍA', 'TURISMO Y HOTELERÍA'
                ].map((facultad) => (
                  <option key={facultad} value={facultad}>
                    {facultad}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Teléfono"
                value={telefono}
                maxLength="12"
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />

              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona un cargo</option>
                <option value="Alumno">Alumno</option>
                <option value="Docente">Docente</option>
                <option value="Director">Director</option>
              </select>

              <select
                value={permiso}
                onChange={(e) => setPermiso(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Permisos</option>
                <option value="lectura">Lectura</option>
                <option value="escritura">Escritura</option>
              </select>

              <ComponentSubirImg setGetUrlImage={setGetUrlImage} getUrlImage={getUrlImage} />

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={isEditing ? handleEditPersona : handleAddPersona}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
                >
                  {isEditing ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    clearForm();
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalUNC;
