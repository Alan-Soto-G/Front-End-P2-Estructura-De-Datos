import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';
import './GraphMap.css';

// Función para obtener el color según el nivel de riesgo
const getColorByRiskLevel = (riskLevel: number): string => {
  switch (riskLevel) {
    case 1:
      return 'green'; // Bajo riesgo
    case 2:
      return 'orange'; // Riesgo moderado
    case 3:
      return 'red'; // Alto riesgo
    default:
      return 'gray'; // Desconocido
  }
};

// Genera un color aleatorio en formato hexadecimal
const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const GraphMap: React.FC = () => {
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graphDataString = localStorage.getItem('userMap');
    // Las rutas se guardan en 'userRoutes'
    const routesDataString = localStorage.getItem('userRoutes');
    const graphData = graphDataString
      ? JSON.parse(graphDataString)
      : { points: [], edges: [] };
    // Se espera que las rutas estén dentro de un objeto { routes: [...] }
    const routesData = routesDataString ? JSON.parse(routesDataString).routes : [];

    // Filtra las rutas que tengan puntos definidos
    const validRoutes = routesData.filter(
      (route: any) => route.points && Array.isArray(route.points) && route.points.length > 0
    );

    // Genera un mapa de colores para cada ruta válida
    const routeColors = validRoutes.reduce((acc: any, route: any) => {
      acc[route.route_id] = generateRandomColor();
      return acc;
    }, {});

    // Mapea los nodos y asigna colores
    const nodes = graphData.points.map((point: any) => {
      // Encuentra todas las rutas a las que pertenece el nodo
      const routesForNode = validRoutes.filter((route: any) =>
        route.points.includes(point.id)
      );
      let color = getColorByRiskLevel(point.risk_level);
      if (routesForNode.length > 0) {
        // Elige la ruta con mayor popularidad (puedes ajustar la lógica)
        const selectedRoute = routesForNode.reduce((prev: any, current: any) =>
          prev.popularity > current.popularity ? prev : current
        );
        color = routeColors[selectedRoute.route_id];
      }
      return {
        id: point.id,
        label: point.name,
        title: `${point.description}\nNivel de riesgo: ${point.risk_level}`,
        color,
      };
    });

    // Mapea las aristas y asigna colores
    const edges = graphData.edges.map((edge: any) => {
      // Encuentra todas las rutas que contienen tanto el nodo de origen como el destino
      const routesForEdge = validRoutes.filter((route: any) =>
        route.points.includes(edge.from) && route.points.includes(edge.to)
      );
      let color = 'gray';
      if (routesForEdge.length > 0) {
        const selectedRoute = routesForEdge.reduce((prev: any, current: any) =>
          prev.popularity > current.popularity ? prev : current
        );
        color = routeColors[selectedRoute.route_id];
      }
      return {
        from: edge.from,
        to: edge.to,
        arrows: edge.directed ? 'to' : '',
        label: `${edge.distance_meters} m`,
        color,
      };
    });

    // Configuración del grafo
    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 14,
        },
      },
      edges: {
        font: {
          size: 12,
          align: 'middle',
        },
        color: 'gray',
        arrows: {
          to: { enabled: true, scaleFactor: 1 },
        },
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        stabilization: {
          iterations: 200,
        },
      },
      interaction: {
        zoomView: false,
        dragView: false,
      },
      layout: {
        hierarchical: false,
        improvedLayout: true,
      },
    };

    // Renderiza el grafo en el contenedor
    if (graphContainerRef.current) {
      new Network(graphContainerRef.current, data, options);
    }
  }, []);

  return (
    <div className="graph-container">
      <h2 className="graph-title">Mapa de Grafo</h2>
      <div ref={graphContainerRef} className="graph-box"></div>
    </div>
  );
};

export default GraphMap;