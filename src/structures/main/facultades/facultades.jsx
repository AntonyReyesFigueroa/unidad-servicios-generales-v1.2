'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import ComponentSubirImg from '@/components/subir-imagen';

// Expresión regular para validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PersonalUNC = () => {
  const [facultades, setFacultades] = useState([]);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [birthday, setFechaNacimiento] = useState('');
  const [cargo, setCargo] = useState('');
  const [pertenencia, setPertenencia] = useState('');
  const [getUrlImage, setGetUrlImage] = useState('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725998380/empleados/qi8foyk50crirjaq7xgf.png');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);

  const apiUrl = '/api/user';

  // Fetch Facultades
  const fetchEmpleados = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setFacultades(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudo obtener los datos de los facultades', 'error');
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Validaciones
  const validateNombres = (nombre) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre) && nombre.length >= 10 && nombre.length <= 70;

  const validateDni = (dni) => dni.length === 8 && /^\d+$/.test(dni);
  // const validateTelefono = (telefono) => telefono.length >= 9 && telefono.length <= 12 && /^\d+$/.test(telefono);
  // const validateFechaNacimiento = (fecha) => {
  //   const nacimiento = new Date(fecha);
  //   const hoy = new Date();
  //   const edad = hoy.getFullYear() - nacimiento.getFullYear();
  //   return nacimiento <= hoy && edad >= 18 && edad <= 100;
  // };

  // Preparar para editar facultad
  const handleEditClick = (facultad) => {
    setEmail(facultad.email);
    setNombre(facultad.nombre);
    setTelefono(facultad.telefono);
    setDni(facultad.dni);
    setFechaNacimiento(facultad.birthday);
    setCargo(facultad.cargo);
    setPertenencia(facultad.pertenencia);
    setGetUrlImage(facultad.img);
    setCurrentEmpleado(facultad);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
        clearForm();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);


  // Agregar Facultad
  const handleAddFacultad = async () => {
    if (!validateNombres(nombre)) {
      return Swal.fire('Error', 'El nombre debe tener entre 10 y 70 caracteres y solo contener letras y espacios.', 'error');
    }
    if (!validateDni(dni)) {
      return Swal.fire('Error', 'El DNI debe tener exactamente 8 caracteres numéricos.', 'error');
    }
    // if (!validateTelefono(telefono)) {
    //   return Swal.fire('Error', 'El teléfono debe tener entre 9 y 12 caracteres numéricos.', 'error');
    // }
    // if (!validateFechaNacimiento(birthday)) {
    //   return Swal.fire('Error', 'Fecha de nacimiento inválida. La edad debe estar entre 18 y 100 años.', 'error');
    // }
    if (!emailRegex.test(email)) {
      return Swal.fire('Error', 'Introduce un correo válido.', 'error');
    }
    if (!cargo || !pertenencia) {
      return Swal.fire('Error', 'Debes seleccionar un cargo y un pertenencia.', 'error');
    }

    const nuevoEmpleado = {
      email,
      nombre,
      telefono,
      dni,
      birthday,
      cargo,
      permiso: 'Carrera Universitaria',
      pertenencia,
      img: getUrlImage,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEmpleado),
      });

      if (response.ok) {
        Swal.fire('Facultad agregado', '', 'success');
        fetchEmpleados();
        setShowModal(false);
        clearForm();
      } else {
        Swal.fire('Error', 'El facultad ya existe o los campos ingresados son incorrectos', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al agregar al facultad', 'error');
    }
  };

  // Editar Facultad
  const handleEditFacultad = async () => {
    if (!validateNombres(nombre)) {
      return Swal.fire('Error', 'El nombre debe tener entre 10 y 70 caracteres y solo contener letras y espacios.', 'error');
    }
    if (!validateDni(dni)) {
      return Swal.fire('Error', 'El DNI debe tener exactamente 8 caracteres numéricos.', 'error');
    }
    // if (!validateTelefono(telefono)) {
    //   return Swal.fire('Error', 'El teléfono debe tener entre 9 y 12 caracteres numéricos.', 'error');
    // }
    // if (!validateFechaNacimiento(birthday)) {
    //   return Swal.fire('Error', 'Fecha de nacimiento inválida. La edad debe estar entre 18 y 100 años.', 'error');
    // }
    if (!emailRegex.test(email)) {
      return Swal.fire('Error', 'Introduce un correo válido.', 'error');
    }
    if (!cargo || !pertenencia) {
      return Swal.fire('Error', 'Debes seleccionar un cargo y un pertenencia.', 'error');
    }

    const updatedEmpleado = {
      email,
      nombre,
      telefono,
      dni,
      birthday,
      cargo,
      pertenencia,
      permiso: 'Carrera Universitaria',
      img: getUrlImage || currentEmpleado.img,
    };

    try {
      const response = await fetch(`${apiUrl}/${currentEmpleado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmpleado),
      });

      if (response.ok) {
        Swal.fire('Facultad actualizado', '', 'success');
        fetchEmpleados();
        setShowModal(false);
        clearForm();
      } else {
        Swal.fire('Error', 'El facultad ya existe o los campos ingresados son incorrectos', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al actualizar al facultad', 'error');
    }
  };

  // Eliminar Facultad
  const handleDeleteEmpleado = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: `¿Estás seguro de eliminar a ${nombre}?`,
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
          Swal.fire('Facultad eliminado', '', 'success');
          fetchEmpleados();
        } else {
          Swal.fire('Error', 'No se pudo eliminar al facultad', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error al eliminar al facultad', 'error');
      }
    }
  };

  const clearForm = () => {
    setEmail('');
    setNombre('');
    setTelefono('');
    setDni('');
    setFechaNacimiento('');
    setCargo('');
    setPertenencia('');
    setGetUrlImage('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725998380/empleados/qi8foyk50crirjaq7xgf.png');
    setCurrentEmpleado(null);
    setIsEditing(false);
  };

  // Filtrado de facultades
  const filteredEmpleados = facultades.filter((facultad) =>
    facultad?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facultad?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facultad?.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Facultades</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
        >
          + Añadir usuario de Facultad
        </button>
      </div>

      <div className="relative flex justify-center my-4 mb-10">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar facultad"
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
        <div className="pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {filteredEmpleados.map((facultad) => (

            facultad.pertenencia !== 'Unidad de Servicios Generales' ?
              <div
                key={facultad.id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out max-w-sm mx-auto"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-center pb-5">{facultad.nombre}</h3>
                  <div className="flex justify-center items-center mb-5">
                    <Image
                      src={facultad.img}
                      alt={facultad.nombre}
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                      style={{ aspectRatio: '1 / 1' }}
                    />
                  </div>
                  <p
                    className="text-blue-500 cursor-pointer hover:underline text-center"
                    onClick={() => {
                      navigator.clipboard.writeText(facultad.email);
                      Swal.fire('Correo copiado', facultad.email, 'success');
                    }}
                  >
                    {facultad.email}
                  </p>
                  <p className="text-gray-600 text-center mt-2">Cargo: {facultad.cargo}</p>
                  <p className="text-gray-600 text-center">Teléfono: {facultad.telefono}</p>
                </div>
                <div className="flex justify-center space-x-4 ">
                  <button
                    onClick={() => handleEditClick(facultad)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteEmpleado(facultad.id, facultad.nombre)}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              :
              ''

          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 overflow-y-auto transition-opacity duration-300">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg space-y-6 h-auto max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-center">{isEditing ? 'Editar Facultad' : 'Añadir Facultad'}</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Nombres y apellidos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="DNI"
                value={dni}
                onChange={(e) => {
                  if (e.target.value.length <= 8) {
                    setDni(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                placeholder="Fecha de nacimiento"
                value={birthday}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => {
                  if (e.target.value.length <= 12) {
                    setTelefono(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Seleccionar Cargo</option>
                <option value="Director(a)">Director(a) </option>
                <option value="Sub Director(a)">Sub Director(a)</option>
                <option value="Administración">Administración</option>
              </select>
              <select
                value={pertenencia}
                onChange={(e) => setPertenencia(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona carrera</option>
                <option value="Administración">Administración</option>
                <option value="Agronomía">Agronomía</option>
                <option value="Biología y Biotecnología">Biología y Biotecnología</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Derecho">Derecho</option>
                <option value="Economía">Economía</option>
                <option value="Educación: Cc. Nn, Qq y Biol.">Educación: Cc. Nn, Qq y Biol.</option>
                <option value="Educación: Ed. Primaria">Educación: Ed. Primaria</option>
                <option value="Educación: Inglés, Español">Educación: Inglés, Español</option>
                <option value="Educación: Lenguaje y Literatura">Educación: Lenguaje y Literatura</option>
                <option value="Educación: Matemática y Física">Educación: Matemática y Física</option>
                <option value="Enfermería">Enfermería</option>
                <option value="Ing. Industrias Alimentarias">Ing. Industrias Alimentarias</option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Ingeniería de Minas">Ingeniería de Minas</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Forestal">Ingeniería Forestal</option>
                <option value="Ingeniería Geológica">Ingeniería Geológica</option>
                <option value="Ingeniería Hidráulica">Ingeniería Hidráulica</option>
                <option value="Ingeniería Zootecnista">Ingeniería Zootecnista</option>
                <option value="Medicina Humana">Medicina Humana</option>
                <option value="Medicina Veterinaria">Medicina Veterinaria</option>
                <option value="Obstetricia">Obstetricia</option>
                <option value="Sociología">Sociología</option>
                <option value="Turismo y Hotelería">Turismo y Hotelería</option>
              </select>
              <ComponentSubirImg setGetUrlImage={setGetUrlImage} getUrlImage={getUrlImage} />
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={isEditing ? handleEditFacultad : handleAddFacultad}
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
