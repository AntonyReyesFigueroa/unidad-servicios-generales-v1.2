import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(request, { params }) {
    const { email } = params;

    try {
        // Fetch de los usuarios
        const usuariosResponse = await fetch("https://66ca95fa59f4350f064f7413.mockapi.io/usuario");
        if (!usuariosResponse.ok) {
            throw new Error(`Error al obtener usuarios: ${usuariosResponse.status}`);
        }
        const usuarios = await usuariosResponse.json();

        // Buscar el usuario por email
        const usuario = usuarios.find((u) => u.email === email);
        if (!usuario) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }




        // Fetch de las incidencias
        const incidenciasResponse = await fetch("https://66ca96db59f4350f064f7699.mockapi.io/incicencia/1");
        if (!incidenciasResponse.ok) {
            throw new Error(`Error al obtener incidencias: ${incidenciasResponse.status}`);
        }
        const { incidencia: incidencias } = await incidenciasResponse.json();

        // Filtrar incidencias por email del usuario
        const incidenciasFiltradas = incidencias.filter((incidencia) => incidencia.usuario.email === email);

        // Retornar las incidencias encontradas
        return NextResponse.json(incidenciasFiltradas, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint GET:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { email } = params;

    try {
        const body = await request.json();
        const { asunto, mensaje } = body;

        if (!asunto || !mensaje) {
            return NextResponse.json({ error: "Asunto y mensaje son obligatorios" }, { status: 400 });
        }

        const usuariosResponse = await fetch("https://66ca95fa59f4350f064f7413.mockapi.io/usuario");
        if (!usuariosResponse.ok) {
            throw new Error(`Error al obtener usuarios: ${usuariosResponse.status}`);
        }
        const usuarios = await usuariosResponse.json();

        const usuario = usuarios.find((u) => u.email === email);
        if (!usuario) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const incidenciasResponse = await fetch("https://66ca96db59f4350f064f7699.mockapi.io/incicencia/1");
        if (!incidenciasResponse.ok) {
            throw new Error(`Error al obtener incidencias: ${incidenciasResponse.status}`);
        }
        const { incidencia: incidencias } = await incidenciasResponse.json();

        const nuevaIncidencia = {
            id: randomUUID(),
            asunto,
            mensaje,
            estado_solicitud: "Documento pendiente",
            estado_reparacion: "Pendiente",
            fecha_inicio: new Date().toLocaleDateString("en-GB"),
            fecha_terminado: null,
            usuario,
            responsable: {},
            id_incidencia_material: [],
        };

        const updatedIncidencias = [...incidencias, nuevaIncidencia];

        const putResponse = await fetch("https://66ca96db59f4350f064f7699.mockapi.io/incicencia/1", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ incidencia: updatedIncidencias }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo actualizar el arreglo incidencia.");
        }

        return NextResponse.json(nuevaIncidencia, { status: 201 });
    } catch (error) {
        console.error("Error en el endpoint POST:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

