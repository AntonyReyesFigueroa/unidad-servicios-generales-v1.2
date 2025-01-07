import { NextResponse } from "next/server";

const url = 'https://66ca95fa59f4350f064f7413.mockapi.io/usuario'

export async function GET() {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data)

    } catch (error) {

        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}


// Expresión regular para validar correos electrónicos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
    try {
        // Leer el cuerpo de la solicitud
        const body = await request.json();

        // Validar campos obligatorios
        const requiredFields = ['email', 'nombre', 'dni', 'img', 'cargo', 'permiso', 'pertenencia'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Field "${field}" is required` },
                    { status: 400 }
                );
            }
        }

        // Validar el formato del correo electrónico
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Verificar si el correo ya existe en MockAPI
        const existingUsersResponse = await fetch(url);
        if (!existingUsersResponse.ok) {
            throw new Error(`Failed to fetch users: ${existingUsersResponse.statusText}`);
        }

        const existingUsers = await existingUsersResponse.json();
        const emailExists = existingUsers.some(user => user.email === body.email);

        if (emailExists) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 } // 409 Conflict
            );
        }

        // Asignar valores predeterminados a campos opcionales
        const data = {
            id: body.id || null, // MockAPI genera automáticamente el ID si no lo envías
            email: body.email,
            nombre: body.nombre,
            dni: body.dni,
            telefono: body.telefono || 'telefono no agregado',
            birthday: body.birthday || 'fecha no agregada',
            img: body.img,
            cargo: body.cargo,
            permiso: body.permiso,
            pertenencia: body.pertenencia,
        };

        // Enviar los datos a MockAPI
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to post data: ${response.statusText}`);
        }

        const result = await response.json();

        // Retornar la respuesta
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: "Failed to post data" },
            { status: 500 }
        );
    }
}


