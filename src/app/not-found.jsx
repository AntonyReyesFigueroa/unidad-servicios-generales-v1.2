import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
    return (
        <section className='flex h-[calc(100vh-7rem)] justify-center items-center' >
            <div>

                <div className='flex justify-center items-center my-24'>
                    <h1 className='text-4xl font-bold text-center'>
                        Unidad de Servicios generales
                    </h1>
                </div>


                <div className='flex justify-center items-center my-3'>
                    <Image
                        src="/logo.png"
                        alt="google"
                        className=""
                        width={100}
                        height={100}
                        priority
                    />
                </div>

                <div className='flex justify-center items-center my-3'>
                    <h1 className='text-4xl font-bold text-center'>
                        Pagina no encontrada
                    </h1>
                </div>

                <div className='flex justify-center items-center my-3'>
                    <Link
                        className='text-white text-2xl mt-5 bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105'
                        href='/'>
                        Volver
                    </Link>
                </div>
            </div>
        </section>
    )
}
