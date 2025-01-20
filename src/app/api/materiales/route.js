
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Hacer un GET a la API para obtener los datos completos
        const response = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();

        // Retornar todos los materiales en el arreglo `incidencia_material`
        return NextResponse.json(data.incidencia_material, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}


export async function POST(request) {

}
