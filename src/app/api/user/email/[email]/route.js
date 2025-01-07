import { NextResponse } from "next/server";

const url = "https://66ca95fa59f4350f064f7413.mockapi.io/usuario";

export async function GET(request, { params }) {
    const { email } = params;

    try {
        // Validar que el correo esté presente
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validar el formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Hacer la solicitud a MockAPI para obtener todos los usuarios
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const users = await response.json();

        // Buscar al usuario por el correo
        const user = users.find((u) => u.email === email);

        if (!user) {
            return NextResponse.json(
                { error: `User with email ${email} not found` },
                { status: 404 }
            );
        }

        // Retornar los datos del usuario
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return NextResponse.json(
            { error: "Failed to fetch user by email" },
            { status: 500 }
        );
    }
}


// Expresión regular para validar correos electrónicos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {

}
