import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ income, expense }) {
    // Chart data configuration
    const data = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [income, expense],
                backgroundColor: [
                    '#27ae60', // Green for income
                    '#c0392b', // Red for expense
                ],
                borderColor: [
                    '#27ae60',
                    '#c0392b',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Chart options configuration
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 14,
                        weight: '600',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '₹' + context.parsed.toLocaleString();
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', maxWidth: '400px', margin: '0 auto' }}>
            {income > 0 || expense > 0 ? (
                <Pie data={data} options={options} />
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px', 
                    color: '#999',
                    fontStyle: 'italic'
                }}>
                    No data to display. Add some transactions to see the chart.
                </div>
            )}
        </div>
    );
}

export default PieChart;

