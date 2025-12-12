import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import PieChart from './PieChart';
import ExpenseTrendsChart from './ExpenseTrendsChart';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses])

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }



    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    return (
        <div className="home-page-container">
            {/* Header with Welcome message centered and Logout button in top-right */}
            <div className="home-header">
                <h1 className="welcome-text">
                    <span style={{ color: '#8a2be2' }}>Welcome</span>{' '}
                    <span style={{ color: '#333' }}>{loggedInUser}</span>
                </h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            {/* Two-column layout */}
            <div className="home-content-wrapper">
                {/* Left column - Main content (70%) */}
                <div className="left-content">
                    <ExpenseDetails
                        incomeAmt={incomeAmt}
                        expenseAmt={expenseAmt}
                    />

                    <ExpenseForm
                        addTransaction={addTransaction} />

                    <ExpenseTable
                        expenses={expenses}
                        deleteExpens={deleteExpens}
                    />
                </div>

                {/* Right column - Charts */}
                <div className="right-content">
                    {/* Pie Chart */}
                    <div className="chart-container">
                        <h2>Income vs Expense</h2>
                        <PieChart income={incomeAmt} expense={expenseAmt} />
                    </div>

                    {/* Expense Trends Chart */}
                    <div className="chart-container">
                        <h2>Expense Trends</h2>
                        <ExpenseTrendsChart expenses={expenses} />
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home