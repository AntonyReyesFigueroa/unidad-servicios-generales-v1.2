'use client'
import Swal from "sweetalert2";
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


export default function EditarIncidencia({ incidencia, userData, isCambios, setIsCambios, closeModal }) {
    return (
        <div>
            {userData.permiso === "Carrera Universitaria" ? (
                <EditarIncidenciaCarreraUniversitaria
                    incidencia={incidencia}
                    userData={userData}
                    isCambios={isCambios}
                    setIsCambios={setIsCambios}
                    closeModal={closeModal}
                />
            ) :
                ["Administrador", "Archivista"].includes(userData.permiso) ? (
                    <EditarIncidenciaAdmiArchi
                        incidencia={incidencia}
                        userData={userData}
                        isCambios={isCambios}
                        setIsCambios={setIsCambios}
                        closeModal={closeModal}
                    />
                )
                    :
                    ["Operario"].includes(userData.permiso) ? (
                        <EditarIncidenciaOperario
                            incidencia={incidencia}
                            userData={userData}
                            isCambios={isCambios}
                            setIsCambios={setIsCambios}
                            closeModal={closeModal}
                        />
                    )
                        :
                        (
                            <div className="p-4 text-red-600 text-center">
                                No tienes permiso para editar esta incidencia.
                            </div>
                        )}
        </div>
    );
}

function EditarIncidenciaCarreraUniversitaria({ incidencia, userData, isCambios, setIsCambios, closeModal }) {
    const [asunto, setAsunto] = useState(incidencia.asunto);
    const [mensaje, setMensaje] = useState(incidencia.mensaje);
    const [loading, setLoading] = useState(false);

    const handleEnviar = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/incidencia/${incidencia.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    asunto,
                    mensaje,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la incidencia");
            }

            Swal.fire({
                icon: "success",
                title: "Incidencia actualizada",
                text: "Los datos de la incidencia se actualizaron correctamente.",
                confirmButtonColor: "#3085d6",
            });

            setIsCambios(!isCambios); // Refrescar cambios
            closeModal(); // Cerrar el modal
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al actualizar la incidencia.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-[90%] max-w-2xl rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Incidencia</h2>
                    <br />
                    <span className="italic">Oficio N°: {incidencia.id}</span>
                    <br />
                    <form>
                        {/* Campo de Asunto */}
                        <label className="block text-gray-700 mb-2 font-medium">Asunto</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                            placeholder="Escribe el asunto"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                        />

                        {/* Campo de Mensaje */}
                        <label className="block text-gray-700 mb-2 font-medium">Mensaje</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                            rows="6"
                            placeholder="Escribe el mensaje"
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                        ></textarea>

                        {/* Firma automática */}
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">
                                Atentamente,
                                <br />
                                <span className="font-bold">{userData.nombre}</span>
                                <br />
                                <span className="italic">{userData.cargo}</span>
                                <br />
                                <span className="italic">{userData.pertenencia}</span>
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={handleEnviar}
                                disabled={loading}
                            >
                                {loading ? "Enviando..." : "Enviar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


function EditarIncidenciaAdmiArchi({ incidencia, userData, isCambios, setIsCambios, closeModal }) {
    const [responsableData, setResponsableData] = useState(null);
    const [allOperarios, setAllOperarios] = useState([]);
    const [filteredOperarios, setFilteredOperarios] = useState([]);
    const [selectedCargo, setSelectedCargo] = useState("");
    const [selectedOperario, setSelectedOperario] = useState(null);
    const [isEditingResponsable, setIsEditingResponsable] = useState(false);
    const [isLoadingResponsable, setIsLoadingResponsable] = useState(false);


    const [isEditingSolicitud, setIsEditingSolicitud] = useState(false);
    const [isEditingReparacion, setIsEditingReparacion] = useState(false);
    const [estadoSolicitud, setEstadoSolicitud] = useState(incidencia.estado_solicitud);
    const [estadoReparacion, setEstadoReparacion] = useState(incidencia.estado_reparacion);
    const [isLoadingSolicitud, setIsLoadingSolicitud] = useState(false);
    const [isLoadingReparacion, setIsLoadingReparacion] = useState(false);

    useEffect(() => {
        if (incidencia.responsable) {
            setResponsableData(incidencia.responsable);
        }
    }, [incidencia]);

    const fetchOperarios = async () => {
        try {
            const response = await fetch("/api/user/permiso/Operario");
            const data = await response.json();
            setAllOperarios(data);
            setFilteredOperarios(data);
        } catch (error) {
            console.error("Error fetching operarios:", error);
        }
    };

    const saveResponsable = async () => {
        if (!selectedOperario) return;
        setIsLoadingResponsable(true);
        try {
            await fetch(`/api/incidencia/responsable/${incidencia.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedOperario),
            });
            setResponsableData(selectedOperario);
            setIsEditingResponsable(false);
            setIsCambios(!isCambios);
            MySwal.fire({
                icon: "success",
                title: "Responsable asignado correctamente",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error saving responsable:", error);
        } finally {
            setIsLoadingResponsable(false);
        }
    };

    const updateEstado = async (campo, valor) => {
        const payload = { [campo]: valor };
        const setLoading = campo === "estado_solicitud" ? setIsLoadingSolicitud : setIsLoadingReparacion;
        setLoading(true);
        try {
            await fetch(`/api/incidencia/${incidencia.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (campo === "estado_solicitud") {
                setEstadoSolicitud(valor);
                setIsEditingSolicitud(false);
            } else {
                setEstadoReparacion(valor);
                setIsEditingReparacion(false);
            }
            setIsCambios(!isCambios);
            MySwal.fire({
                icon: "success",
                title: "Estado actualizado correctamente",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error updating estado:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 bg-white shadow-md rounded-md space-y-6">
            <h2 className="text-lg font-semibold mb-4">Detalles de la Incidencia</h2>

            {/* Información del Usuario */}
            <div>
                <h3 className="text-md font-semibold mb-2">Información del Usuario</h3>
                <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                    <p><strong>Asunto:</strong> {incidencia.asunto}</p>
                    <p><strong>Mensaje:</strong> {incidencia.mensaje}</p>
                    <p>
                        <strong>Estado de Solicitud:</strong>
                        {!isEditingSolicitud ? (
                            <>
                                {estadoSolicitud}{" "}
                                <FaEdit
                                    className="inline text-blue-500 cursor-pointer hover:text-blue-700"
                                    onClick={() => setIsEditingSolicitud(!isEditingSolicitud)}
                                />
                            </>
                        ) : (
                            <select
                                className="border rounded-md p-1"
                                value={estadoSolicitud}
                                onChange={(e) => updateEstado("estado_solicitud", e.target.value)}
                            >
                                <option value="Documento pendiente">Documento pendiente</option>
                                <option value="Documento recepcionado">Documento recepcionado</option>
                                <option value="Documento tramitado">Documento tramitado</option>
                                <option value="Documento aceptado">Documento aceptado</option>
                                <option value="Documento denegado">Documento denegado</option>
                            </select>
                        )}
                    </p>
                    <p>
                        <strong>Estado de Reparación:</strong>
                        {!isEditingReparacion ? (
                            <>
                                {estadoReparacion}{" "}
                                <FaEdit
                                    className="inline text-blue-500 cursor-pointer hover:text-blue-700"
                                    onClick={() => setIsEditingReparacion(!isEditingReparacion)}
                                />
                            </>
                        ) : (
                            <select
                                className="border rounded-md p-1"
                                value={estadoReparacion}
                                onChange={(e) => updateEstado("estado_reparacion", e.target.value)}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="En espera de materiales">En espera de materiales</option>
                                <option value="En proceso">En proceso</option>
                                <option value="Terminado">Terminado</option>
                            </select>
                        )}
                    </p>
                    <p><strong>Fecha de Inicio:</strong> {incidencia.fecha_inicio}</p>
                    <p>
                        <strong>Fecha de Terminado:</strong>
                        {incidencia.fecha_terminado ? incidencia.fecha_terminado : "Incidencia aún no terminada"}
                    </p>
                </div>
            </div>

            {/* Información del Responsable */}
            <div>
                <h3 className="text-md font-semibold mb-2 flex items-center">
                    Información del Responsable
                    <FaEdit
                        className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() => {
                            setIsEditingResponsable(!isEditingResponsable);
                            fetchOperarios();
                        }}
                    />
                </h3>
                {!isEditingResponsable ? (
                    <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                        {responsableData ? (
                            <>
                                <p><strong>Nombre:</strong> {responsableData.nombre}</p>
                                <p><strong>Email:</strong> {responsableData.email}</p>
                                <p><strong>DNI:</strong> {responsableData.dni}</p>
                                <p><strong>Teléfono:</strong> {responsableData.telefono}</p>
                                <p><strong>Cargo:</strong> {responsableData.cargo}</p>
                                <p><strong>Pertenencia:</strong> {responsableData.pertenencia}</p>
                            </>
                        ) : (
                            <p className="text-red-500">Sin responsable asignado.</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">Filtrar por Cargo</label>
                            <select
                                id="cargo"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={selectedCargo}
                                onChange={(e) => {
                                    const cargo = e.target.value;
                                    setSelectedCargo(cargo);
                                    setFilteredOperarios(allOperarios.filter(op => op.cargo === cargo));
                                }}
                            >
                                <option value="">Selecciona un cargo</option>
                                {[...new Set(allOperarios.map(op => op.cargo))].map(cargo => (
                                    <option key={cargo} value={cargo}>{cargo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="operario" className="block text-sm font-medium text-gray-700">Seleccionar Responsable</label>
                            <select
                                id="operario"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => {
                                    const operarioId = e.target.value;
                                    setSelectedOperario(allOperarios.find(op => op.id === operarioId));
                                }}
                            >
                                <option value="">Selecciona un operario</option>
                                {filteredOperarios.map(op => (
                                    <option key={op.id} value={op.id}>{op.nombre} ({op.cargo})</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${isLoadingResponsable && "opacity-50 cursor-not-allowed"}`}
                            onClick={saveResponsable}
                            disabled={isLoadingResponsable}
                        >
                            {isLoadingResponsable ? "Cargando..." : "Guardar Responsable"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function EditarIncidenciaOperario({
    incidencia,
    userData,
    isCambios,
    setIsCambios,
    closeModal,
}) {
    const [isEditingReparacion, setIsEditingReparacion] = useState(false);
    const [estadoReparacion, setEstadoReparacion] = useState(
        incidencia.estado_reparacion || "Pendiente"
    );
    const [isLoading, setIsLoading] = useState(false);

    const estadosReparacion = [
        "Pendiente",
        "En espera de materiales",
        "En proceso",
        "Terminado",
    ];

    const handleGuardarEstadoReparacion = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/incidencia/${incidencia.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ estado_reparacion: estadoReparacion }),
            });

            if (!response.ok) {
                throw new Error("Error al guardar el estado de reparación");
            }

            await MySwal.fire({
                icon: "success",
                title: "Estado de reparación actualizado correctamente",
                timer: 2000,
            });

            setIsEditingReparacion(false);
            setIsCambios(!isCambios); // Actualizar los datos
        } catch (error) {
            await MySwal.fire({
                icon: "error",
                title: "Error al actualizar el estado de reparación",
                text: error.message,
                timer: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Editar Incidencia</h2>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-600">Información General</h3>
                <p>
                    <strong>Asunto:</strong> {incidencia.asunto}
                </p>
                <p>
                    <strong>Mensaje:</strong> {incidencia.mensaje}
                </p>
                <p>
                    <strong>Estado Solicitud:</strong>{" "}
                    <span className="text-gray-500 italic">No permitido editar</span>
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-600">
                    Estado de Reparación
                </h3>
                {!isEditingReparacion ? (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-700">{estadoReparacion}</p>
                        <button
                            className="text-blue-500 hover:text-blue-700 transition"
                            onClick={() => setIsEditingReparacion(true)}
                        >
                            ✏️ Editar
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-2">
                        <select
                            className="p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            value={estadoReparacion}
                            onChange={(e) => setEstadoReparacion(e.target.value)}
                        >
                            {estadosReparacion.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => setIsEditingReparacion(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                onClick={handleGuardarEstadoReparacion}
                                disabled={isLoading}
                            >
                                {isLoading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={closeModal}
            >
                Cerrar
            </button>
        </div>
    );
}