import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const baseUrl = "https://66ca95fa59f4350f064f7413.mockapi.io/material/1";

export async function GET() {
    try {
        // Realizar la solicitud a la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const data = await response.json();

        // Verificar si existe el campo "material"
        const materiales = data.material || [];

        // Retornar todos los datos del arreglo "material"
        return NextResponse.json(materiales, { status: 200 });
    } catch (error) {
        console.error("Error fetching material data:", error);
        return NextResponse.json(
            { error: "Failed to fetch material data" },
            { status: 500 }
        );
    }
}



// Genera la fecha actual en formato dd/mm/aaaa
function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


export async function POST(request) {
    try {
        // Leer el cuerpo de la solicitud
        const body = await request.json();
        const { nombre, categoria, stock, precio_unidad, orden_pedido } = body;

        // Generar un nuevo ID y fecha para el material
        const id = uuidv4();
        const fecha = getCurrentDate();

        // Crear el nuevo objeto material
        const newMaterial = {
            nombre,
            categoria,
            stock,
            precio_unidad,
            id,
            fecha,
            orden_pedido,
        };

        // Obtener los datos existentes de materiales desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const data = await response.json();

        // Verificar si existe el campo "material"
        const materiales = data.material || [];

        // Agregar el nuevo material al arreglo de materiales
        materiales.push(newMaterial);

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: materiales }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo agregar el nuevo material.");
        }

        return NextResponse.json(
            { message: "Material agregado correctamente.", material: newMaterial },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error agregando material:", error);
        return NextResponse.json(
            { error: "Failed to add new material" },
            { status: 500 }
        );
    }
}
