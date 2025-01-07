import { NextResponse } from "next/server";

const baseUrl = "https://66ca96db59f4350f064f7699.mockapi.io/incidencia/1";

export async function GET(request, { params }) {
    try {
        // Decodificar el valor del parámetro 'pertenencia' de forma segura
        const pertenencia = decodeURIComponent(params?.pertenencia || "");

        // Validar si el parámetro 'pertenencia' está presente
        if (!pertenencia) {
            return NextResponse.json(
                { error: "El parámetro 'pertenencia' es obligatorio." },
                { status: 400 }
            );
        }

        // Obtener los datos de incidencias desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Error al obtener las incidencias.");
        }

        const data = await response.json();

        // Verificar si existe el campo "incidencia"
        const incidencias = data.incidencia || [];

        // Filtrar las incidencias por pertenencia
        const incidenciasFiltradas = incidencias.filter(
            (item) =>
                item.usuario?.pertenencia &&
                item.usuario.pertenencia.toLowerCase() === pertenencia.toLowerCase()
        );

        if (incidenciasFiltradas.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron incidencias para la pertenencia: ${pertenencia}` },
                { status: 404 }
            );
        }

        // Retornar las incidencias filtradas
        return NextResponse.json(incidenciasFiltradas, { status: 200 });
    } catch (error) {
        console.error("Error al filtrar incidencias por pertenencia:", error);
        return NextResponse.json(
            { error: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
