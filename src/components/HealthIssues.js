// src/components/HealthConsultation.js
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

// Importar las propuestas de mejora
import improvementProposals from '../components/improvementProposals';

// Registrar las escalas y otros elementos necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Lista de colores para las barras
const colors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
];

const HealthConsultation = () => {
    const [data, setData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    processCSVData(results.data);
                    setLoading(false);
                },
            });
        }
    };

    const processCSVData = (data) => {
        const totalStudents = data.length;
        const problemTypes = {};
        const genderCount = { male: 0, female: 0 };
        const ageGroups = {
            '0-18': 0,
            '19-35': 0,
            '36-50': 0,
            '51+': 0,
        };
        const studentVisits = {};

        // Procesar los datos
        data.forEach(row => {
            const issue = row.tipo_problema;
            const gender = row.genero ? row.genero.toLowerCase() : '';
            const age = parseInt(row.edad, 10);
            const studentId = row.id_estudiante;

            // Contar visitas por estudiante
            studentVisits[studentId] = (studentVisits[studentId] || 0) + 1;

            // Contar tipos de problemas
            problemTypes[issue] = (problemTypes[issue] || 0) + 1;

            // Contar género
            if (gender === 'male') {
                genderCount.male += 1;
            } else if (gender === 'female') {
                genderCount.female += 1;
            }

            // Contar grupos de edad
            if (age <= 18) {
                ageGroups['0-18'] += 1;
            } else if (age <= 35) {
                ageGroups['19-35'] += 1;
            } else if (age <= 50) {
                ageGroups['36-50'] += 1;
            } else {
                ageGroups['51+'] +=  1;
            }
        });

        // Ordenar y obtener los problemas más frecuentes
        const sortedProblems = Object.entries(problemTypes).sort((a, b) => b[1] - a[1]);
        const mostFrequentProblems = sortedProblems.slice(0, 6); // Top 6 problemas

        setSummary({
            totalStudents,
            genderCount,
            ageGroups,
            mostFrequentProblems,
            studentVisits,
        });
        setData(data);
    };

    const chartData = {
        labels: summary?.mostFrequentProblems.map(problem => problem[0]) || [],
        datasets: [
            {
                label: 'Frecuencia de Problemas de Salud',
                data: summary?.mostFrequentProblems.map(problem => problem[1]) || [],
                backgroundColor: summary?.mostFrequentProblems.map((_, index) => colors[index % colors.length]) || [],
            },
        ],
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Consulta de Salud
            </Typography>
            <input
                accept=".csv"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
                <Button variant="contained" component="span" color="primary">
                    Cargar Archivo CSV
                </Button>
            </label>
            {loading && <CircularProgress style={{ marginTop: '20px' }} />}
            {summary && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h5">Resumen de Datos</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Total de Estudiantes: ${summary.totalStudents}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Hombres: ${summary.genderCount.male}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Mujeres: ${summary.genderCount.female}`} />
                            </ListItem>
                        </List>
                        <Typography variant="h6">Grupos de Edad</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary={`0-18 años: ${summary.ageGroups['0-18']}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`19-35 años: ${summary.ageGroups['19-35']}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`36-50 años: ${summary.ageGroups['36-50']}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`51+ años: ${summary.ageGroups['51+']}`} />
                            </ListItem>
                        </List>
                        <Typography variant="h6">Propuestas de Mejora en Servicios de Salud</Typography>
                        <List>
                            {summary.mostFrequentProblems.map((problem, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={improvementProposals[problem[0]] || `No hay propuestas para ${problem[0]}.`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
            {summary && (
                <div style={{ marginTop: '20px' }}>
                    <Bar data={chartData} />
                </div>
            )}
            {summary && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h5">Asistencias al Consultorio por Estudiante</Typography>
                        <List>
                            {Object.entries(summary.studentVisits).map(([studentId, visits]) => (
                                <ListItem key={studentId}>
                                    <ListItemText primary={`Estudiante ID ${studentId}: ${visits} visitas`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default HealthConsultation;