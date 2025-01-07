import { NextResponse } from "next/server";

const url = 'https://66ca95fa59f4350f064f7413.mockapi.io/usuario';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        // Verificar si el ID es válido
        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        // Hacer la solicitud a MockAPI para obtener el usuario por ID
        const response = await fetch(`${url}/${id}`);

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch user with ID ${id}` },
                { status: response.status }
            );
        }

        const user = await response.json();

        // Retornar los datos del usuario
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return NextResponse.json(
            { error: "Failed to fetch user by ID" },
            { status: 500 }
        );
    }
}



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(request, { params }) {
    const { id } = params;



    try {
        // Verificar si el ID es válido
        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        // Leer el cuerpo de la solicitud
        const body = await request.json();

        // Validar que el correo sea válido si se incluye
        if (body.email && !emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }


        // Validar que el correo no esté vacío si se envía
        if (body.email) {
            // Obtener todos los usuarios para verificar correos duplicados
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.statusText}`);
            }

            const users = await response.json();

            // Verificar si el correo ya existe en otro usuario
            const emailExists = users.some(user => user.email === body.email && user.id !== id);
            if (emailExists) {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 409 } // 409 Conflict
                );
            }
        }

        // Realizar la actualización del usuario
        const patchResponse = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!patchResponse.ok) {
            throw new Error(`Failed to update user: ${patchResponse.statusText}`);
        }

        const updatedUser = await patchResponse.json();

        // Retornar la respuesta con el usuario actualizado
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        // Validar que el ID esté presente
        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        // Intentar eliminar el usuario en MockAPI
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        // Retornar éxito en la eliminación
        return NextResponse.json(
            { message: `User with ID ${id} successfully deleted` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}