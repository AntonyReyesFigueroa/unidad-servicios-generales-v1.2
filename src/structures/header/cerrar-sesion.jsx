'use client'

import { useRouter } from 'next/navigation';
import React from 'react'
import Cookie from 'js-cookie';
import Link from 'next/link';

export const BtnCerrarSección = () => {

  const removeCookie = (name) => {
    Cookie.remove(name)
  }

  const router = useRouter();
  return (
    <div>
      <a
        className='btn_salir_header'
        onClick={
          () => {
            {
              removeCookie('appSession')
              // removeCookie('user')
              // removeCookie('carreraUniversitaria')
              // removeCookie('correo_auth')
              // removeCookie('facultad')
              // removeCookie('permiso')
              router.push('/api/auth/logout')
            }
          }
        }
        href="/api/auth/logout">Cerrar Sesion</a>
    </div>

  )
}
