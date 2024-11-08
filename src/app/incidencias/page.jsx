'use client'
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Usamos useRouter para la redirección
import IncidenciasInfo from '@/structures/main/incidencias/infor';

export default function Incidencias() {

    return (
        <div>
            <IncidenciasInfo />
        </div>
    );
}
