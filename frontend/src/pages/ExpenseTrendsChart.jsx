import React from 'react';
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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function ExpenseTrendsChart({ expenses }) {
    // Process expenses to get trends data
    const processExpensesData = () => {
        if (!expenses || expenses.length === 0) {
            return { labels: [], incomeData: [], expenseData: [] };
        }

        // Group expenses by date or category
        // For simplicity, we'll show the last 7 transactions
        const recentExpenses = expenses.slice(-7);

        const labels = recentExpenses.map((item, index) =>
            item.text ? item.text : `Transaction ${index + 1}`
        );

        const incomeData = recentExpenses.map(item =>
            item.amount > 0 ? item.amount : 0
        );

        const expenseData = recentExpenses.map(item =>
            item.amount < 0 ? Math.abs(item.amount) : 0
        );

        return { labels, incomeData, expenseData };
    };

    const { labels, incomeData, expenseData } = processExpensesData();

    // Chart data configuration
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: '#27ae60',
                borderColor: '#27ae60',
                borderWidth: 1,
            },
            {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#c0392b',
                borderColor: '#c0392b',
                borderWidth: 1,
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
                    padding: 10,
                    font: {
                        size: 12,
                        weight: '600',
                    },
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '₹' + context.parsed.y.toLocaleString();
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '₹' + value;
                    },
                },
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 11,
                        weight: '500',
                    },
                    autoSkip: false,
                    maxTicksLimit: 10,
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            {expenses && expenses.length > 0 ? (
                <Bar data={data} options={options} />
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    fontStyle: 'italic'
                }}>
                    No transaction data available for trends.
                </div>
            )}
        </div>
    );
}

export default ExpenseTrendsChart;

