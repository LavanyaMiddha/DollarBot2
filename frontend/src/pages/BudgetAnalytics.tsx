import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
//import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GraphData = {
    labels: string[];
    values: number[];
};

const GraphComponent: React.FC = () => {
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch data from the backend
        const fetchGraphData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/graph-data');
                const data: GraphData = await response.json();
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!graphData) {
        return <div>No data available</div>;
    }

    // Chart.js configuration
    const chartData = {
        labels: graphData.labels,
        datasets: [
            {
                label: 'Dataset',
                data: graphData.values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Sample Bar Chart',
            },
        },
    };

    //return <Bar data={chartData} options={options} />;
};

export default GraphComponent;
