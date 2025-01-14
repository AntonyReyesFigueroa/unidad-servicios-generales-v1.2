import { NextResponse } from "next/server";

const BASE_URL = "https://66ca96db59f4350f064f7699.mockapi.io/incicencia/";

export async function POST(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: "El parámetro 'id' es obligatorio." },
            { status: 400 }
        );
    }

    try {
        // Parsear el body de la solicitud
        const body = await request.json();
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "El cuerpo de la solicitud debe ser un objeto válido." },
                { status: 400 }
            );
        }

        // Realizar un GET para obtener los datos actuales
        const response = await fetch(`${BASE_URL}1`);
        if (!response.ok) {
            throw new Error(`Error al obtener las incidencias: ${response.statusText}`);
        }

        const data = await response.json();
        const incidencias = data.incidencia || [];

        // Filtrar la incidencia por ID
        const incidencia = incidencias.find((item) => item.id === id);
        if (!incidencia) {
            return NextResponse.json(
                { error: `No se encontró la incidencia con el ID "${id}".` },
                { status: 404 }
            );
        }

        // Actualizar el campo "responsable"
        const updatedIncidencia = { ...incidencia, responsable: body };

        // Realizar un PUT para actualizar la incidencia
        const putResponse = await fetch(`${BASE_URL}1`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, incidencia: incidencias.map((i) => (i.id === id ? updatedIncidencia : i)) }),
        });

        if (!putResponse.ok) {
            throw new Error(`Error al actualizar la incidencia: ${putResponse.statusText}`);
        }

        // Retornar la respuesta con los datos actualizados
        return NextResponse.json({ message: "Responsable actualizado exitosamente.", incidencia: updatedIncidencia });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al procesar la solicitud." },
            { status: 500 }
        );
    }
}
