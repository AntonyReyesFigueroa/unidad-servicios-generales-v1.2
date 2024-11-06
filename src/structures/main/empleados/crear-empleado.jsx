'use client'
import React, { useState } from 'react'
import FormularioEmpleado from './formulario-empleado'
import ListaUsuarios from './ListaUsuarios'


export default function CrearEmpleado() {

    const [isUploadUser, setIsUploadUser] = useState(true)
    // console.log(isUploadUser);
    

    return (
        <div>
            <h1 className="text-5xl font-extrabold text-center mt-12 mb-12 text-black tracking-widest font-serif">
                Crear Empleado - Unidad de servicios generales UNC
            </h1>
            <FormularioEmpleado isUploadUser={isUploadUser} setIsUploadUser={setIsUploadUser} />
            <ListaUsuarios isUploadUser={isUploadUser} setIsUploadUser={setIsUploadUser}/>
        </div>
    )
}
