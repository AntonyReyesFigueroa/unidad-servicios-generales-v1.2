import { NextResponse } from "next/server";

const baseUrl = "https://66ca96db59f4350f064f7699.mockapi.io/incicencia/1";

export async function GET(request, { params }) {
    try {

        // Decodificar el valor del parámetro 'permiso' de forma segura
        const permiso = decodeURIComponent(params?.permiso || "");

        // Validar si el parámetro 'permiso' está presente
        if (!permiso) {
            return NextResponse.json(
                { error: "El parámetro 'permiso' es obligatorio." },
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

        // Filtrar las incidencias por permiso
        const incidenciasFiltradas = incidencias.filter(
            (item) =>
                item.responsable?.nombre &&
                item.responsable.nombre.toLowerCase() === permiso.toLowerCase() ||

                item.usuario?.pertenencia &&
                item.usuario.pertenencia.toLowerCase() === permiso.toLowerCase() ||

                permiso.toLowerCase() === 'administrador' ||
                permiso.toLowerCase() === 'archivista'
        );

        if (incidenciasFiltradas.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron incidencias para la permiso: ${permiso}` },
                { status: 404 }
            );
        }

        // Retornar las incidencias filtradas
        return NextResponse.json(incidenciasFiltradas, { status: 200 });

    } catch (error) {
        console.error("Error al filtrar incidencias por permiso:", error);
        return NextResponse.json(
            { error: "Error interno del servidor." },
            { status: 500 }
        );
    }
}


export async function POST(request) {

}
