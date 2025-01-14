import { NextResponse } from "next/server";

const url = "https://66ca95fa59f4350f064f7413.mockapi.io/usuario";

export async function GET(request, { params }) {
    const { permiso } = params;

    try {
        // Validar que el permiso esté presente
        if (!permiso) {
            return NextResponse.json(
                { error: "El permiso es obligatorio (Ejemplo: Administrador, Archivista, Operario)." },
                { status: 400 }
            );
        }

        // Validar que el permiso sea válido
        const permisosValidos = ["Administrador", "Archivista", "Operario"];
        if (!permisosValidos.includes(permiso)) {
            return NextResponse.json(
                { error: `Permiso no válido. Los valores aceptados son: ${permisosValidos.join(", ")}.` },
                { status: 400 }
            );
        }

        // Hacer la solicitud para obtener todos los usuarios
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }

        const users = await response.json();

        // Filtrar los usuarios según el permiso
        const filteredUsers = users.filter((user) => user.permiso === permiso);

        if (filteredUsers.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron usuarios con el permiso "${permiso}".` },
                { status: 404 }
            );
        }

        // Retornar los datos filtrados
        return NextResponse.json(filteredUsers, { status: 200 });
    } catch (error) {
        console.error("Error filtrando usuarios por permiso:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al procesar la solicitud." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    // Este método no se ve afectado en este caso
}
