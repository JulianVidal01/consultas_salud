import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DataList = ({ data }) => {
    // Contar la frecuencia de problemas de salud
    const frecuencia = data.reduce((acc, item) => {
        acc[item.tipo_problema] = (acc[item.tipo_problema] || 0) + 1;
        return acc;
    }, {});

    const frecuenciaArray = Object.keys(frecuencia).map(key => ({
        tipo_problema: key,
        cantidad: frecuencia[key],
    }));

    return (
        <div>
            <h2>Frecuencia de Problemas de Salud</h2>
            <BarChart width={600} height={300} data={frecuenciaArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo_problema" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        {item.fecha}: {item.tipo_problema} - {item.sintomas}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataList;