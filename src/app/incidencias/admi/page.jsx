import React from 'react'
import Header from '@/structures/header/header'
import Footer from '@/structures/footer/footer'
import IncidenciasFacultad from '@/structures/main/incidencias/admi/principal'

export default function PageAdmi() {
    return (
        <div>
            <Header />
            <IncidenciasFacultad />
            <Footer />
        </div>
    )
}
