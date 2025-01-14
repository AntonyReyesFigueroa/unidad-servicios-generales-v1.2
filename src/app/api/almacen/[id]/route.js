import { NextResponse } from "next/server";

const baseUrl = "https://66ca95fa59f4350f064f7413.mockapi.io/material/1";

export async function GET(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta

    try {
        // Realizar la solicitud a la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const data = await response.json();

        // Verificar si existe el campo "material"
        const materiales = data.material || [];

        // Filtrar el material por ID
        const material = materiales.find((item) => item.id === id);

        if (!material) {
            return NextResponse.json(
                { error: `No se encontró un material con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Retornar el material encontrado
        return NextResponse.json(material, { status: 200 });
    } catch (error) {
        console.error("Error fetching material by ID:", error);
        return NextResponse.json(
            { error: "Failed to fetch material by ID" },
            { status: 500 }
        );
    }
}


export async function PATCH(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta

    try {
        // Leer el cuerpo de la solicitud para obtener los datos a actualizar
        const body = await request.json();
        const { nombre, categoria, stock, precio_unidad } = body;

        // Obtener los datos de materiales desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const data = await response.json();

        // Verificar si existe el campo "material"
        const materiales = data.material || [];

        // Buscar el material por ID
        const materialIndex = materiales.findIndex((item) => item.id === id);

        if (materialIndex === -1) {
            return NextResponse.json(
                { error: `No se encontró un material con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Actualizar los campos del material encontrado
        if (nombre !== undefined) materiales[materialIndex].nombre = nombre;
        if (categoria !== undefined) materiales[materialIndex].categoria = categoria;
        if (stock !== undefined) materiales[materialIndex].stock = stock;
        if (precio_unidad !== undefined) materiales[materialIndex].precio_unidad = precio_unidad;

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: materiales }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo actualizar el material.");
        }

        return NextResponse.json(
            { message: `Material con ID: ${id} fue actualizado correctamente.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error actualizando material por ID:", error);
        return NextResponse.json(
            { error: "Failed to update material by ID" },
            { status: 500 }
        );
    }
}




export async function DELETE(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta

    try {
        // Obtener los datos de materiales desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const data = await response.json();

        // Verificar si existe el campo "material"
        const materiales = data.material || [];

        // Buscar y eliminar el material por ID
        const updatedMateriales = materiales.filter((item) => item.id !== id);

        if (materiales.length === updatedMateriales.length) {
            return NextResponse.json(
                { error: `No se encontró un material con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: updatedMateriales }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo eliminar el material.");
        }

        return NextResponse.json(
            { message: `Material con ID: ${id} fue eliminado correctamente.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error eliminando material por ID:", error);
        return NextResponse.json(
            { error: "Failed to delete material by ID" },
            { status: 500 }
        );
    }
}
