import { NextResponse } from "next/server";

const url = 'https://66ca96db59f4350f064f7699.mockapi.io/incicencia'

export async function GET() {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data[0].incidencia)

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

}


