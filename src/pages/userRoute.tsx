import React, { useState, useEffect } from 'react';
import GraphManagement from '../components/graphManagement';
import GraphMap from '../components/graphMap';

const UserRoute: React.FC = () => {
    const [isGraphVisible, setIsGraphVisible] = useState(true);
    const [userRoutes, setUserRoutes] = useState<any[]>([]);
    const [nodes, setNodes] = useState<{ id: number; name: string }[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<number | "">("");
    const [mapKey, setMapKey] = useState<number>(0); // Para forzar refresco del GraphMap

    const handleCloseGraph = () => {
        setIsGraphVisible(false);
    };

    // Cargar nodos y rutas desde localStorage al montar el componente
    useEffect(() => {
        const routes = localStorage.getItem('userRoutes');
        if (routes) {
            setUserRoutes(JSON.parse(routes));
        }
        const userMap = localStorage.getItem('userMap');
        if (userMap) {
            const parsedMap = JSON.parse(userMap);
            setNodes(parsedMap.points || []);
        }
    }, []);

    const fetchUserRoutes = async () => {
        const userId = localStorage.getItem('userID');
        if (!userId) {
            console.error('No se encontró userID en localStorage');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/get-user-routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Rutas recuperadas:', data);
                localStorage.setItem('userRoutes', JSON.stringify(data));
                setUserRoutes(data);
            } else {
                console.error('Error al obtener las rutas:', response.status);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    useEffect(() => {
        fetchUserRoutes();
    }, []);

    // Función para eliminar un nodo y actualizar el mapa en localStorage
    const handleDeleteNode = async () => {
        const userId = localStorage.getItem('userID');
        if (!userId || !selectedNodeId) {
            alert("Por favor, selecciona un nodo para eliminar.");
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/delete-node', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, point_id: selectedNodeId }),
            });
            if (response.ok) {
                alert("Nodo eliminado con éxito.");
                // Actualiza el estado de nodos eliminando el nodo borrado
                const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
                setNodes(updatedNodes);
                setSelectedNodeId(""); // Reinicia la selección

                // Actualiza el objeto userMap en localStorage
                const userMapString = localStorage.getItem('userMap');
                if (userMapString) {
                    const userMap = JSON.parse(userMapString);
                    userMap.points = updatedNodes;
                    localStorage.setItem('userMap', JSON.stringify(userMap));
                }
                // Forzamos el refresco del componente GraphMap cambiando su key
                setMapKey(prevKey => prevKey + 1);
            } else {
                console.error("Error al eliminar el nodo:", response.status);
                alert("Error al eliminar el nodo.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    // Función para eliminar una ruta (sin cambios respecto a lo anterior)
    const handleDeleteRoute = async (routeId: number) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/delete-route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ route_id: routeId }),
            });
            if (response.ok) {
                alert("Ruta eliminada con éxito.");
                const updatedRoutes = userRoutes.filter((route) => route.route_id !== routeId);
                setUserRoutes(updatedRoutes);
                localStorage.setItem('userRoutes', JSON.stringify(updatedRoutes));
            } else {
                console.error("Error al eliminar la ruta:", response.status);
                alert("Error al eliminar la ruta.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <>
            {isGraphVisible && (
                <GraphManagement
                    visible={true}
                    title="Nueva Ruta"
                    node={false}
                    onClose={handleCloseGraph}
                />
            )}
            {/* Se le asigna una key dinámica para forzar su re-montaje */}
            <GraphMap key={mapKey} />

            {/* Contenedor principal para controles, posicionado a 2cm de la derecha */}
            <div className="controls-container">
                {/* Contenedor para eliminar nodo */}
                <div className="controls">
                    <h2>Eliminar Nodo</h2>
                    <select
                        value={selectedNodeId}
                        onChange={(e) => setSelectedNodeId(Number(e.target.value))}
                        className="p-2 border rounded w-full"
                    >
                        <option value="" disabled hidden>
                            Selecciona un nodo
                        </option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleDeleteNode}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Eliminar Nodo
                    </button>
                </div>

                {/* Contenedor dinámico para mostrar rutas */}
                <div className="routes-container">
                    <h2>Rutas del Usuario</h2>
                    {userRoutes.length > 0 ? (
                        userRoutes.map((route) => (
                            <div key={route.route_id} className="route-card border p-4 rounded mb-4 shadow">
                                <h3 className="font-bold text-lg">{route.name}</h3>
                                <p><strong>Popularidad:</strong> {route.popularity}</p>
                                <p><strong>Dificultad:</strong> {route.difficulty.toFixed(2)}</p>
                                <p><strong>Distancia:</strong> {route.distance_meters} metros</p>
                                <p><strong>Duración:</strong> {route.duration_minutes.toFixed(1)} minutos</p>
                                <p><strong>Método:</strong> {route.method}</p>
                                <button
                                    onClick={() => handleDeleteRoute(route.route_id)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                                >
                                    Eliminar Ruta
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay rutas disponibles.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserRoute;