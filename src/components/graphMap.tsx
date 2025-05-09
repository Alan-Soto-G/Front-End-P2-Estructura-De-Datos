import React from 'react';
import { useState } from 'react';

// Obtén los datos del localStorage y conviértelos a JSON
const graphDataString = localStorage.getItem('userMap');
const graphData = graphDataString ? JSON.parse(graphDataString) : { points: [], edges: [] };

console.log(localStorage.getItem('userMap'));
// Asegúrate de que los datos sean válidos antes de mapear
const nodes = graphData.points.map((point) => ({
  id: point.id,
  label: point.name,
  title: `${point.description}\nNivel de riesgo: ${point.risk_level}`,
  color: getColorByRiskLevel(point.risk_level),
}));

const edges = graphData.edges.map((edge) => ({
  from: edge.from,
  to: edge.to,
  arrows: edge.directed ? 'to' : '', // si es dirigido, añade flecha
  label: `${edge.distance_meters} m`,
}));