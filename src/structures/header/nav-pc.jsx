'use client'
import React, { useState } from 'react'
import MenuDesplegable from './menu-desplegable'

export const NavPC = () => {
    const [contentElemente, setContentElemente] = useState('')
    return (
        <ul className='ul__nav_header'>
            <li className='li__nav_header'>
                <MenuDesplegable
                    element={'Incidencias'}
                    main={'/'}
                    subElements={[
                        {
                            subElement: 'Dependencias',
                            ruta: '/incidencias/facultad',
                        },
                        {
                            subElement: 'Operario',
                            ruta: '/incidencias/operario',
                        },
                        {
                            subElement: 'Administrador',
                            ruta: '/incidencias/admi',
                        }
                    ]}
                    contentElemente={contentElemente}
                    setContentElemente={setContentElemente}
                />
            </li>
            <li className='li__nav_header'>
                <MenuDesplegable
                    element={'Almacen'}
                    main={'/almacen'}
                    subElements={[
                        {
                            subElement: 'almacen',
                            ruta: '/almacen'
                        },
                    ]}
                    contentElemente={contentElemente}
                    setContentElemente={setContentElemente}
                />
            </li>
            <li className='li__nav_header'>
                <MenuDesplegable
                    element={'Empleados'}
                    main={'/empleados'}
                    subElements={[
                        {
                            subElement: 'Crear Empleado',
                            ruta: '/empleados/crear'
                        },
                        {
                            subElement: 'Editar Empleado',
                            ruta: '/empleados/editar'
                        }
                    ]}
                    contentElemente={contentElemente}
                    setContentElemente={setContentElemente}
                />
                {/* <Link href='/about'>Empleados</Link> */}
            </li>
            <li className='li__nav_header'>
                <MenuDesplegable
                    element={'Facultades'}
                    main={'/facultades'}
                    subElements={[
                        {
                            subElement: 'Facultades',
                            ruta: '/facultades'
                        },

                    ]}
                    contentElemente={contentElemente}
                    setContentElemente={setContentElemente}
                />
            </li>

        </ul>
    )
}
