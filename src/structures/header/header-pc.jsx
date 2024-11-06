import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '@/style/header/header-pc.css'
import UserHeader from './user'
import { NavPC } from './nav-pc'


export default function HeaderPc() {
    return (
        <header className='header'>
            <nav className='header_navPC'>

                <div className='nav_container_logoimg_title'>

                    <Image
                        src="/logo.png"
                        alt="google"
                        className="img_logo_unc"
                        width={40}
                        height={40}
                        priority
                    />

                    <h3 className='nav__title text-6xl font-bold tracking-wide text-gray-800 uppercase'>
                        <Link href='/'>
                            UNIDAD DE SERVICIOS GENERALES
                        </Link>
                    </h3>
                </div>

                <NavPC />

                <UserHeader />



            </nav>
        </header>
    )
}
