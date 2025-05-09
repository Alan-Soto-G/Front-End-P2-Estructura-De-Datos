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

const GraphMap: React.FC = () => {
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Obtén los datos del localStorage y conviértelos a JSON
    const graphDataString = localStorage.getItem('userMap');
    const graphData = graphDataString
      ? JSON.parse(graphDataString)
      : { points: [], edges: [] };

    // Mapea los nodos y las aristas
    const nodes = graphData.points.map((point: any) => ({
      id: point.id,
      label: point.name,
      title: `${point.description}\nNivel de riesgo: ${point.risk_level}`,
      color: getColorByRiskLevel(point.risk_level),
    }));

    const edges = graphData.edges.map((edge: any) => ({
      from: edge.from,
      to: edge.to,
      arrows: edge.directed ? 'to' : '', // Si es dirigido, añade flecha
      label: `${edge.distance_meters} m`,
    }));

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
    solver: 'forceAtlas2Based', // Usa un solver que mejora la distribución
    stabilization: {
      iterations: 200, // Más iteraciones para una mejor distribución
    },
  },
  interaction: {
    zoomView: false, // Deshabilita el zoom
    dragView: false, // Deshabilita el desplazamiento
  },
  layout: {
    hierarchical: false, // Cambia a true si quieres un diseño jerárquico
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
    <h2 className="graph-title">Tu mapa</h2>
    <div
      ref={graphContainerRef}
      className="graph-box"
    ></div>
  </div>
);
};

export default GraphMap;