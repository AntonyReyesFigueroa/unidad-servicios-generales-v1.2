import React from 'react'
import Header from '@/structures/header/header'
import Footer from '@/structures/footer/footer'
import IncidenciasOperario from '@/structures/main/incidencias/operario/principal'

export default function PageOperario() {
    return (
        <div>
            <Header />
            <IncidenciasOperario />
            <Footer />
        </div>
    )
}
