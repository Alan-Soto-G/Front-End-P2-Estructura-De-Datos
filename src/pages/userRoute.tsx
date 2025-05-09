import React, { useState } from 'react';
import GraphManagement from '../components/graphManagement';
import GraphMap from  '../components/graphMap';

const UserRoute: React.FC = () => {
    const [isGraphVisible, setIsGraphVisible] = useState(true); // Estado para controlar la visibilidad

    const handleCloseGraph = () => {
        setIsGraphVisible(false); // Oculta el componente
    };
    const fetchUserRoutes = async () => {
        const userId = localStorage.getItem('userID'); // Obtén el userID del localStorage
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
                body: JSON.stringify({ user_id: userId }), // Envía el userID al backend
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Rutas del usuario recuperadas con éxito:', data);
                localStorage.setItem('userRoutes', JSON.stringify(data)); // Guarda la data en localStorage
                console.log('Rutas guardadas en localStorage:', localStorage.getItem('userRoutes'));
            } else {
                console.error('Error al obtener las rutas del usuario:', response.status);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    // Llama al fetch directamente
    fetchUserRoutes();

    return (
        <>
            {isGraphVisible && (
                <GraphManagement
                    visible={true}
                    title="Nueva Ruta"
                    node={false}
                    onClose={handleCloseGraph} // Pasar la función para cerrar
                />
            )}
            <GraphMap />
            
        </>
    );
};

export default UserRoute;