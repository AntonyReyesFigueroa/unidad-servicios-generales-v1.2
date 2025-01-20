import { v4 as uuidv4 } from 'uuid';


import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = params; // ID de incidencia recibido como parámetro

        // Hacer un GET a la API para obtener los datos completos
        const response = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();

        // Buscar en el arreglo `incidencia_material` el elemento con el ID especificado
        const incidenciaMaterial = data.incidencia_material.find(item => item.id === id);

        if (!incidenciaMaterial) {
            return NextResponse.json(
                { message: `No se encontró la incidencia con ID: ${id}` },
                { status: 404 }
            );
        }

        // Retornar la incidencia encontrada como JSON
        return NextResponse.json(incidenciaMaterial, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}


export async function POST(request, { params }) {
    try {
        const { id } = params; // ID de incidencia que recibes como parámetro
        const body = await request.json(); // Datos recibidos en el body

        // GET para obtener los datos actuales desde la API
        const response = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();
        const incidenciaMaterialArray = data.incidencia_material;

        // Crear un nuevo objeto con los datos recibidos y agregarlo al arreglo
        const newMaterial = {
            id: uuidv4(), // Generar un UUID único
            id_incidencia_material: id, // ID recibido como parámetro
            incidencia_material: body, // Todo lo recibido en el body
        };

        // Actualizar el arreglo `incidencia_material`
        incidenciaMaterialArray.push(newMaterial);

        // GET para obtener el inventario actual
        const inventoryResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1');
        if (!inventoryResponse.ok) {
            throw new Error('Error al obtener el inventario de la API');
        }

        const inventoryData = await inventoryResponse.json();
        const inventory = inventoryData.material;

        // Ajustar el inventario según los productos en el nuevo pedido
        const updatedInventory = inventory.map(item => {
            const newProduct = body.productos.find(p => p.id === item.id);

            if (newProduct) {
                // Reducir el `stock` del producto por la cantidad pedida
                return { ...item, stock: item.stock - newProduct.cantidad };
            }

            return item; // Dejar los demás productos sin cambios
        });

        // PUT para actualizar el inventario
        const inventoryPutResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ material: updatedInventory }),
        });

        if (!inventoryPutResponse.ok) {
            throw new Error('Error al actualizar el inventario en la API');
        }

        // PUT para actualizar el arreglo de incidencia_material
        const putResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ incidencia_material: incidenciaMaterialArray }),
        });

        if (!putResponse.ok) {
            throw new Error('Error al guardar datos en la API');
        }

        // Retornar el nuevo material añadido
        return new Response(JSON.stringify(newMaterial), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}




export async function PATCH(request, { params }) {
    try {
        const { id } = params; // ID de incidencia que se recibe como parámetro
        const body = await request.json(); // Datos recibidos en el body

        // Hacer un GET para obtener los datos actuales desde la API
        const response = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();
        const incidenciaMaterialArray = data.incidencia_material;

        // Buscar el índice del elemento con el ID que queremos modificar
        const index = incidenciaMaterialArray.findIndex(item => item.id === id);
        if (index === -1) {
            return NextResponse.json(
                { message: `No se encontró la incidencia con ID: ${id}` },
                { status: 404 }
            );
        }

        // Guardar una copia de los productos actuales antes de la actualización
        const oldProducts = incidenciaMaterialArray[index].incidencia_material.productos;

        // Actualizar el elemento con los datos nuevos
        const updatedMaterial = {
            ...incidenciaMaterialArray[index],
            incidencia_material: {
                ...incidenciaMaterialArray[index].incidencia_material,
                ...body, // Actualizar con los datos recibidos en el body
            },
        };

        const newProducts = updatedMaterial.incidencia_material.productos;

        // Sustituir el elemento modificado en el arreglo
        incidenciaMaterialArray[index] = updatedMaterial;

        // Hacer un GET para obtener el inventario
        const inventoryResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1');
        if (!inventoryResponse.ok) {
            throw new Error('Error al obtener el inventario de la API');
        }

        const inventoryData = await inventoryResponse.json();
        const inventory = inventoryData.material;

        // Ajustar el inventario basado en la diferencia entre productos antiguos y nuevos
        const updatedInventory = inventory.map(item => {
            const oldProduct = oldProducts.find(p => p.id === item.id);
            const newProduct = newProducts.find(p => p.id === item.id);

            if (oldProduct && newProduct) {
                // Ajustar stock en base a la diferencia entre cantidades
                const quantityDifference = oldProduct.cantidad - newProduct.cantidad;
                return { ...item, stock: item.stock + quantityDifference };
            }

            if (oldProduct && !newProduct) {
                // Si el producto existía antes pero ya no está, devolver toda su cantidad al inventario
                return { ...item, stock: item.stock + oldProduct.cantidad };
            }

            if (!oldProduct && newProduct) {
                // Si el producto es nuevo, restar su cantidad del stock
                return { ...item, stock: item.stock - newProduct.cantidad };
            }

            return item; // Dejar los demás productos sin cambios
        });

        // Guardar el inventario actualizado
        const inventoryPutResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ material: updatedInventory }),
        });

        if (!inventoryPutResponse.ok) {
            throw new Error('Error al actualizar el inventario en la API');
        }

        // Actualizar los datos en la API principal
        const putResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ incidencia_material: incidenciaMaterialArray }),
        });

        if (!putResponse.ok) {
            throw new Error('Error al guardar datos actualizados en la API principal');
        }

        // Retornar el material actualizado
        return NextResponse.json(updatedMaterial, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}



export async function DELETE(request, { params }) {
    try {
        const { id } = params; // ID de incidencia que deseas eliminar

        // Obtener datos del endpoint principal
        const response = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();
        const incidenciaMaterialArray = data.incidencia_material;

        // Buscar el índice del elemento a eliminar
        const index = incidenciaMaterialArray.findIndex(item => item.id === id);
        if (index === -1) {
            return NextResponse.json(
                { message: `No se encontró la incidencia con ID: ${id}` },
                { status: 404 }
            );
        }

        // Obtener el elemento eliminado
        const deletedMaterial = incidenciaMaterialArray.splice(index, 1)[0];

        // Actualizar el arreglo en la API principal
        const putResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/2', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ incidencia_material: incidenciaMaterialArray }),
        });

        if (!putResponse.ok) {
            throw new Error('Error al guardar los datos actualizados en la API principal');
        }

        // Obtener el inventario
        const inventoryResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1');
        if (!inventoryResponse.ok) {
            throw new Error('Error al obtener el inventario de la API');
        }

        const inventoryData = await inventoryResponse.json();

        // Actualizar el inventario según los productos eliminados
        const updatedInventory = inventoryData.material.map(item => {
            const product = deletedMaterial.incidencia_material.productos.find(p => p.id === item.id);
            if (product) {
                // Devolver las cantidades eliminadas al stock
                return { ...item, stock: item.stock + product.cantidad };
            }
            return item; // Dejar los demás productos igual
        });

        // Guardar el inventario actualizado
        const inventoryPutResponse = await fetch('https://66ca95fa59f4350f064f7413.mockapi.io/material/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ material: updatedInventory }),
        });

        if (!inventoryPutResponse.ok) {
            throw new Error('Error al actualizar el inventario en la API');
        }

        // Retornar el elemento eliminado
        return NextResponse.json(deletedMaterial, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

