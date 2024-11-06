'use client'
import Image from 'next/image'
import React from 'react'
import '@/style/auth/login.css'
import { useRouter } from "next/navigation";

const Login = () => {

    const router = useRouter();

    return (
        <div className='container_login'>
            <div className='encabezado_login_container'>
                <h1 className='title_encabezado'>Universidad Nacional de Cajamarca</h1>
                <div className='espacio_encabezado'></div>
            </div>
            <section className='login'>
                <h1 className='login_title'>Unidad de Servicios Generales</h1>
                <h2 className='login_subtitle'> <span>Iniciar</span>Sesion</h2>
                <div className='container_btn_login'>
                    
                    <div className='btn_login'
                        onClick={() => {
                            router.push('/api/auth/login')
                        }}
                    >
                        <Image
                            src="/logo-google.png"
                            alt="google"
                            className="dark:invert"
                            width={20}
                            height={20}
                            priority
                        />

                        <button>Usar Correo UNC Institucional</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
