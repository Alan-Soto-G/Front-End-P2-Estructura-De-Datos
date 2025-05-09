import React, { useState, useEffect } from 'react';

interface GraphManagementProps {
    visible: boolean;
    title: string;
    node: boolean;
    onClose: () => void;
}

const GraphManagement: React.FC<GraphManagementProps> = ({ visible, title, node, onClose }) => {
    if (!visible) return null;

    const [fromPoint, setFromPoint] = useState<number | "">("");
    const [toPoint, setToPoint] = useState<number | "">("");    
    const [levelRisk, setLevelRisk] = useState<number | "">("");
    const [userDistance, setUserDistance] = useState<number | "">("");
    const [nodes, setNodes] = useState<{ id: number; name: string }[]>([]);
    const [minDistance, setMinDistance] = useState<number>(0);

    useEffect(() => {
        const userMap = localStorage.getItem("userMap");
        if (userMap) {
            try {
                const parsedMap = JSON.parse(userMap);
                setNodes(parsedMap.points || []); // Asegúrate de que `points` exista
                const distances = parsedMap.edges?.map((edge: { distance_meters: number }) => edge.distance_meters) || [];
                const minimumDistance = distances.length > 0 ? Math.min(...distances) : 0;
                setMinDistance(minimumDistance);
            } catch (error) {
                console.error("Error al parsear userMap:", error);
            }
        }
    }, []);

    const handleSubmitt = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("From Point ID:", fromPoint);
        console.log("To Point ID:", toPoint);
        console.log("Nivel de Riesgo:", levelRisk);
        console.log("Distancia del Usuario:", userDistance);
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const experience = userData.experience || "";
        const data = {
                user_id: localStorage.getItem("userID"),
                start: fromPoint,
                end: toPoint,
                experience: experience,
                risk_level: levelRisk,
                user_distance: userDistance,
            };
            console.log("Data to send:", data);

            try {
                const response = await fetch("http://127.0.0.1:5000/submit-route", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Formulario enviado con éxito:", result);
                    alert("Rutas guardadas exitosamente");
                    onClose(); // Cerrar el formulario
                } else {
                    console.error("Error al enviar el formulario:", response.status);
                    alert("Error al guardar la ruta");
                }
            } catch (error) {
                console.error("Error de red:", error);
                alert("No se pudo conectar con el servidor");
            }
    };

    // Filter nodes to exclude the selected fromPoint and toPoint
    const filteredFromNodes = nodes.filter((node) => node.id.toString() !== toPoint);
    const filteredToNodes = nodes.filter((node) => node.id.toString() !== fromPoint);

    return (
        <>
            {/* Fondo semitransparente */}
            <div className="management-overlay" onClick={onClose}></div>

            {/* Contenedor del formulario */}
            <section className="management-card">
                <h1>{title}</h1>
                <form onSubmit={handleSubmitt} className="flex flex-col gap-3 items-center w-full">
                    {node ? (
                        <></>
                    ) : (
                        <div>
                            {/* Lista desplegable para el punto de partida */}
                            <label htmlFor="fromPoint" className="block text-sm font-medium text-gray-700">
                                Punto de partida
                            </label>
                            <select
                                name="selectFromPoint"
                                id="fromPoint"
                                onChange={(e) => setFromPoint(Number(e.target.value))}
                                value={fromPoint}
                                className="bg-gray-100 h-10 w-40 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled hidden>
                                    Seleccione un punto
                                </option>
                                {filteredFromNodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name}
                                    </option>
                                ))}
                            </select>

                            {/* Lista desplegable para el punto de destino */}
                            <label htmlFor="toPoint" className="block text-sm font-medium text-gray-700">
                                Punto de destino
                            </label>
                            <select
                                name="selectToPoint"
                                id="toPoint"
                                onChange={(e) => setToPoint(Number(e.target.value))}
                                value={toPoint}
                                className="bg-gray-100 h-10 w-40 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled hidden>
                                    Seleccione un punto
                                </option>
                                {filteredToNodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name}
                                    </option>
                                ))}
                            </select>

                            {/* Input para Nivel de Riesgo */}
                            <label htmlFor="levelRisk" className="block text-sm font-medium text-gray-700">
                                Nivel de Riesgo
                            </label>
                            <input
                                type="number"
                                id="levelRisk"
                                name="levelRisk"
                                value={levelRisk}
                                onChange={(e) => setLevelRisk(Number(e.target.value))}
                                placeholder="Ingrese el nivel de riesgo"
                                required
                                min={1}
                                max={5}
                                className="bg-gray-100 h-10 w-40 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            />

                            {/* Input para Distancia del Usuario */}
                            <label htmlFor="userDistance" className="block text-sm font-medium text-gray-700">
                                Distancia a recorrer (m)
                            </label>
                            <input
                                type="number"
                                id="userDistance"
                                name="userDistance"
                                value={userDistance}
                                onChange={(e) => setUserDistance(Number(e.target.value))}
                                placeholder="Ingrese la distancia"
                                required
                                min={minDistance}
                                className="bg-gray-100 h-10 w-40 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Guardar
                    </button>
                </form>
            </section>
        </>
    );
};

export default GraphManagement;