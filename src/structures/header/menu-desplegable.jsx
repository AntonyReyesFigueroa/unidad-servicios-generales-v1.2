'use client'
import React, { useState } from 'react'
import '@/style/header/menu-desplegable.css'
import Link from 'next/link';

export default function MenuDesplegable({ element, subElements, contentElemente, setContentElemente, main }) {

    const [isHoverElement, setIsHoverElement] = useState(false)


    const handleClickInside = () => {
        setContentElemente(element)
    };

    return (
        <div
            className='container_general_menu_despliegue'
            onMouseLeave={() => setIsHoverElement(!isHoverElement)}
        >
            <div
                className={`element ${contentElemente === element ? 'text-blue-600' : 'text-black'} 
                    text-base font-semibold tracking-wide  text-center`}

                onMouseEnter={() => {
                    setIsHoverElement(true)
                    handleClickInside()
                }}
                onClick={handleClickInside}
                onMouseLeave={handleClickInside}
            > <Link href={`${main.toString()}`} >   {element}</Link> </div>
            <div>
                {
                    isHoverElement && contentElemente === element ?
                        <div className='container_menuDesplegable'
                            onMouseLeave={() => setIsHoverElement(!isHoverElement)}
                        >
                            <div className='sombreado__menuDespliegue' >
                                {
                                    subElements.map((subElement, i) => (
                                        <div className='subElement' key={i}>
                                            <Link href={subElement.ruta} >   {subElement.subElement}</Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        :
                        ''
                }
            </div>
        </div>
    )
}
