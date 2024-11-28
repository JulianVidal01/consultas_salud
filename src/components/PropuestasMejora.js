// src/components/PropuestasMejora.js
import React, { useState } from 'react';

const PropuestasMejora = () => {
    const [improvementProposals, setImprovementProposals] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [proposalName, setProposalName] = useState('');
    const [solution, setSolution] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProposal = { name: proposalName, solution };
        setImprovementProposals([...improvementProposals, newProposal]);
        setProposalName('');
        setSolution('');
        setIsFormVisible(false); // Ocultar el formulario después de enviar
    };

    return (
        <div>
            <h2>Propuestas de Mejora en Servicios de Salud</h2>
            <button onClick={() => setIsFormVisible(!isFormVisible)}>
                {isFormVisible ? 'Cancelar' : 'Añadir Nueva Propuesta'}
            </button>

            {isFormVisible && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Nombre de la Propuesta:
                            <input
                                type="text"
                                value={proposalName}
                                onChange={(e) => setProposalName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Solución:
                            <textarea
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Guardar Propuesta</button>
                </form>
            )}

            <h3>Propuestas Almacenadas:</h3>
            <ul>
                {improvementProposals.map((proposal, index) => (
                    <li key={index}>
                        <strong>{proposal.name}</strong>: {proposal.solution}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PropuestasMejora;