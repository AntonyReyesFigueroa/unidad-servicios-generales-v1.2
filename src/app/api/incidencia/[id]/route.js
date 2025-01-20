import { NextResponse } from "next/server";

const baseUrl = "https://66ca96db59f4350f064f7699.mockapi.io/incicencia/1";

export async function GET(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta

    try {
        // Obtener los datos de incidencias desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch incidencias");
        }

        const data = await response.json();

        // Verificar si existe el campo "incidencia"
        const incidencias = data.incidencia || [];

        // Filtrar las incidencias para encontrar la que coincide con el ID
        const incidencia = incidencias.find((item) => item.id === id);

        if (!incidencia) {
            return NextResponse.json(
                { error: `No se encontró una incidencia con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Retornar la incidencia encontrada
        return NextResponse.json(incidencia, { status: 200 });
    } catch (error) {
        console.error("Error fetching incidencia by ID:", error);
        return NextResponse.json(
            { error: "Failed to fetch incidencia by ID" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta

    try {
        // Obtener los datos de incidencias desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch incidencias");
        }

        const data = await response.json();

        // Verificar si existe el campo "incidencia"
        const incidencias = data.incidencia || [];

        // Buscar la incidencia por ID
        const incidencia = incidencias.find((item) => item.id === id);

        if (!incidencia) {
            return NextResponse.json(
                { error: `No se encontró una incidencia con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Verificar la condición de "estado_solicitud"
        if (incidencia.estado_solicitud !== "Documento pendiente") {
            return NextResponse.json(
                { error: "Error al eliminar, el documento ya está en proceso, contactarse con el administrador" },
                { status: 403 } // 403 Forbidden
            );
        }

        // Filtrar las incidencias para excluir la que se desea eliminar
        const updatedIncidencias = incidencias.filter((item) => item.id !== id);

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ incidencia: updatedIncidencias }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo actualizar el arreglo incidencia después de la eliminación.");
        }

        return NextResponse.json(
            { message: `La incidencia con ID: ${id} fue eliminada correctamente.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error eliminando incidencia por ID:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}


export async function PATCH(request, { params }) {
    const { id } = params; // Obtener el parámetro id desde la ruta
    let updates;

    try {
        updates = await request.json(); // Obtener los campos a actualizar desde el cuerpo de la solicitud
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    const { asunto, mensaje, estado_reparacion, estado_solicitud, id_incidencia_material } = updates;

    if (!asunto && !mensaje && estado_reparacion && estado_solicitud && id_incidencia_material) {
        return NextResponse.json(
            { error: "No fields to update were provided" },
            { status: 400 }
        );
    }

    try {
        // Obtener los datos de incidencias desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch incidencias");
        }

        const data = await response.json();

        // Verificar si existe el campo "incidencia"
        const incidencias = data.incidencia || [];

        // Encontrar la incidencia que coincide con el ID
        const incidenciaIndex = incidencias.findIndex((item) => item.id === id);

        if (incidenciaIndex === -1) {
            return NextResponse.json(
                { error: `No se encontró una incidencia con el ID: ${id}` },
                { status: 404 }
            );
        }

        // Actualizar los campos "asunto" y "mensaje" si se proporcionan
        if (asunto) incidencias[incidenciaIndex].asunto = asunto;
        if (mensaje) incidencias[incidenciaIndex].mensaje = mensaje;
        if (estado_reparacion) incidencias[incidenciaIndex].estado_reparacion = estado_reparacion;
        if (estado_solicitud) incidencias[incidenciaIndex].estado_solicitud = estado_solicitud;
        if (id_incidencia_material) incidencias[incidenciaIndex].id_incidencia_material = id_incidencia_material;

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ incidencia: incidencias }),
        });

        if (!putResponse.ok) {
            throw new Error("Failed to update incidencia");
        }

        return NextResponse.json(
            { message: `La incidencia con ID: ${id} fue actualizada correctamente.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating incidencia by ID:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
