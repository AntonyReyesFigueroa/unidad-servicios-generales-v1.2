import React from 'react'

export default function Materiales({ incidencia, userData, isCambios, setIsCambios, closeModal }) {

    return (
        <div>
            {
                incidencia.id_incidencia_material ?
                    <div>Materiales</div>
                    :
                    <div>Materiales aún sin asignar</div>
            }

        </div>
    )
}
