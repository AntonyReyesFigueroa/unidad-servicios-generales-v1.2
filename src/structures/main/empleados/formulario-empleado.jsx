'use client'

import ComponentSubirImg from '@/components/subir-imagen';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function FormularioEmpleado({ isUploadUser, setIsUploadUser, isUpdateForm, dataEmpleadoSelect,setSelectedEmpleado }) {

  const [getUrlImage, setGetUrlImage] = useState('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725241226/empleados/fzdhtcnj9aoyawz4nasr.png')

  // console.log(dataEmpleadoSelect);



  const [formData, setFormData] = useState({
    nombres: `${dataEmpleadoSelect ? dataEmpleadoSelect.nombres : ''}`,
    dni: `${dataEmpleadoSelect ? dataEmpleadoSelect.dni : ''}`,
    telefono: `${dataEmpleadoSelect ? dataEmpleadoSelect.telefono : ''}`,
    fechaNacimiento: `${dataEmpleadoSelect ? dataEmpleadoSelect.fechaNacimiento : 'sin fecha'}`,
    cargo: `${dataEmpleadoSelect ? dataEmpleadoSelect.cargo : ''}`,
    permiso: `${dataEmpleadoSelect ? dataEmpleadoSelect.permiso : ''}`,
    email: `${dataEmpleadoSelect ? dataEmpleadoSelect.email : ''}`,
    img: `${dataEmpleadoSelect ? dataEmpleadoSelect.img : getUrlImage}`
  });


  useEffect(() => {

    dataEmpleadoSelect && (
      setGetUrlImage(dataEmpleadoSelect.img)
    )

  }, [dataEmpleadoSelect])


  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      img: getUrlImage,
    }));
  }, [getUrlImage]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    try {
      if (name === 'fechaNacimiento') {
        // Cambiar el formato de fecha de YYYY-MM-DD a DD-MM-YYYY
        const [year, month, day] = value.split('-');
        value.fechaNacimiento = `${day}-${month}-${year}`;
      }
    } catch (error) {

    }

    // Validación del campo de nombres
    if (name === 'nombres') {
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
      if (value.length > 70) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nombre no puede exceder los 70 caracteres.',
          confirmButtonColor: '#4CAF50',
        });
        return;
      }
      if (!nombreRegex.test(value)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nombre solo puede contener letras y espacios.',
          confirmButtonColor: '#4CAF50',
        });
        return;
      }
    }

    // Validación del campo de DNI
    if (name === 'dni' && value.length > 8) return;

    // Validación del campo de teléfono
    if (name === 'telefono' && value.length > 12) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombres, dni, telefono, fechaNacimiento, cargo, permiso, email } = formData;

    if (nombres.length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre está muy corto.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    if (email.length < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingresar correo electronico.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    if (dni.length !== 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'DNI incorrecto, ingrese un DNI válido.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    if (telefono.length < 9) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Número de teléfono inválido.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (fechaNacimiento && (birthDate > today || age < 18 || age > 100 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && dayDiff < 0))) {
      Swal.fire({
        icon: 'error',
        title: age < 18 ? 'Error de edad' : 'Error de fecha',
        text: age < 18 ? 'No se puede registrar el usuario, tiene que ser mayor de edad.' : 'Fecha inválida.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    // Validación del campo de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingrese un correo electrónico válido.',
        confirmButtonColor: '#4CAF50',
        backdrop: `
          rgba(0,0,0,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });
      return;
    }

    if (!cargo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Falta seleccionar el cargo.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    if (!permiso) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Falta seleccionar el permiso.',
        confirmButtonColor: '#4CAF50',
      });
      return;
    }

    try {
      let response = ''
      if (dataEmpleadoSelect) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLEADO}/${dataEmpleadoSelect.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        setSelectedEmpleado(null)
        
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLEADO}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }


      if (response.ok) {
        if (dataEmpleadoSelect) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Empleado editado exitosamente.',
            confirmButtonColor: '#4CAF50',
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Empleado creado exitosamente.',
            confirmButtonColor: '#4CAF50',
          });
        }
        setFormData({
          nombres: '',
          dni: '',
          telefono: '',
          fechaNacimiento: '',
          cargo: '',
          permiso: '',
          email: '', // Restablecer el campo de email
          img: getUrlImage
        });
        setGetUrlImage('https://res.cloudinary.com/dd8snmdx4/image/upload/v1725241226/empleados/fzdhtcnj9aoyawz4nasr.png')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el empleado.',
          confirmButtonColor: '#4CAF50',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al conectar con el servidor.',
        confirmButtonColor: '#4CAF50',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-500 tracking-wide font-serif">
        {
          isUpdateForm ??
          ' Crear empleado'
        }
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <ComponentSubirImg setGetUrlImage={setGetUrlImage} getUrlImage={getUrlImage} />
        <div className="flex-1 space-y-4">
          <input
            type="text"
            name="nombres"
            placeholder="Ingresar nombres completos"
            className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleInputChange}
            value={formData.nombres}
          />

          <input
            type="email"
            name="email"
            placeholder="Ingresar correo electrónico"
            className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleInputChange}
            value={formData.email}
          />

          <input
            type="number"
            name="dni"
            placeholder="Ingresar DNI"
            className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleInputChange}
            value={formData.dni}
          />
          <input
            type="number"
            name="telefono"
            placeholder="Ingresar teléfono"
            className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleInputChange}
            value={formData.telefono}
          />

          <div className="flex flex-wrap md:flex-nowrap justify-between items-center space-y-2 md:space-y-0">
            <label htmlFor="fechaNacimiento" className="text-gray-400 w-full md:w-1/2 text-center md:text-center">
              Ingresar Fecha de cumpleaños :
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              className="w-full md:w-1/2 p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleInputChange}
              value={formData.fechaNacimiento}
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 relative">
              <select
                name="cargo"
                className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleInputChange}
                value={formData.cargo}
              >
                <option value="">Seleccionar cargo</option>
                <option value="Administrador">Administrador</option>
                <option value="Archivista">Archivista</option>
                <option value="Gasfitero">Gasfitero</option>
                <option value="Electricista">Electricista</option>
                <option value="Soldadura">Soldadura</option>
                <option value="Carpinteria">Carpintería</option>
                <option value="Mecanica fina">Mecánica fina</option>
                <option value="Albañilería">Albañilería</option>
                <option value="Albañilería">usuario</option>
                {/* <option value="facultadUNC">facultadUNC</option> */}
              </select>
            </div>
            <div className="w-full md:w-1/2 relative">
              <select
                name="permiso"
                className="w-full p-3 bg-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleInputChange}
                value={formData.permiso}
              >
                <option value="">Seleccionar permiso</option>
                <option value="Administrador">Administrador</option>
                <option value="Archivista">Archivista</option>
                <option value="Operario">Operario</option>
                {/* <option value="Cliente">Cliente</option> */}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          onClick={() => {
            if (!dataEmpleadoSelect) {
              setIsUploadUser(!isUploadUser)
            }
          }
          }
          className="w-80 max-w-xs mt-6 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg transition duration-300"
        >
          {
            isUpdateForm ?
              'Guardar cambios'
              :
              'Crear empleado'
          }
        </button>
      </div>
    </form>
  );
}
