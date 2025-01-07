'use client';
import Image from 'next/image';
import React from 'react';
import '@/style/header/user.css';
import { BtnCerrarSección } from './cerrar-sesion';
import { useUser } from '@auth0/nextjs-auth0/client';
// import Cookie from 'js-cookie';

export default function UserHeader() {
    const { user, error, isLoading } = useUser();

    // Obtener el permiso directamente desde la cookie, ya que se establece en HeaderPage
    // const permiso = Cookie.get('permiso');

    function getFirstName(fullName) {
        return fullName.split(" ")[0];
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        user ? (
            <div className='container_user_header'>
                <div className='container_userHeader_btnSalirHeader'>
                    <b className='user_header'>{getFirstName(user?.name)}</b>
                    <BtnCerrarSección />
                </div>
                <Image
                    src={user.picture}
                    alt={user.name}
                    className="img_logo_user_header"
                    width={50}
                    height={50}
                    priority
                />
            </div>
        ) : (
            <div className='container_user_header'>
                <div className='container_userHeader_btnSalirHeader'>
                    <b className='user_header'>Cargando...</b>
                    <BtnCerrarSección />
                </div>
                <Image
                    src='/user.avif'
                    alt="Sin usuario"
                    className="img_logo_user_header"
                    width={50}
                    height={50}
                    priority
                />
            </div>
        )
    );
}
