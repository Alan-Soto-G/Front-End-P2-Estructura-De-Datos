import React, { useState } from 'react';
import GraphManagement from '../components/graphManagement';

const UserRoute: React.FC = () => {
    const [isGraphVisible, setIsGraphVisible] = useState(true); // Estado para controlar la visibilidad

    const handleCloseGraph = () => {
        setIsGraphVisible(false); // Oculta el componente
    };

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
        </>
    );
};

export default UserRoute;