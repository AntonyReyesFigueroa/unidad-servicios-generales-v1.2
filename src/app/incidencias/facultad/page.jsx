import React from 'react'
import Header from '@/structures/header/header'
import Footer from '@/structures/footer/footer'
import IncidenciasFacultad from '@/structures/main/incidencias/facultad/principal'
export default function PageFacultad() {
    return (
        <div>
            <Header />
            <IncidenciasFacultad />
            <Footer />
        </div>
    )
}
