import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // Add a separate CSS file for styling

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [expName, setExpName] = useState("");
  const [paid, setPaid] = useState(0);
  const [category, setCategory] = useState("");
  const userId = sessionStorage.getItem("userId");

  // Fetch expenses
  useEffect(() => {
    fetch(`http://localhost:8000/expense/myexpenses?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExpenses(data.expenses);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error("Error fetching expenses:", err));
  }, [userId]);

  // Add expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = { expName, paid, category, userId };

    fetch("http://localhost:8000/expense/addexpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExpenses((prevExpenses) => [...prevExpenses, data.expense]);
          setExpName("");
          setPaid(0);
          setCategory("");
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error("Error adding expense:", err));
  };

  // Delete expense
  const handleDeleteExpense = (expenseId) => {
    fetch(`http://localhost:8000/expense/delexpense?id=${expenseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: expenseId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExpenses((prevExpenses) =>
            prevExpenses.filter((expense) => expense._id !== expenseId)
          );
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error("Error deleting expense:", err));
  };

  // Logout functionality
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login"; // Redirect to login page
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="add-expense form">
        <h3>Add New Expense</h3>
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            placeholder="Expense Name"
            value={expName}
            onChange={(e) => setExpName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount Paid"
            value={paid}
            min={0}
            onChange={(e) => setPaid(Number(e.target.value))}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">
            Add Expense
          </button>
        </form>
      </div>
      <div className="expenses-list">
        <h3>Your Expenses</h3>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id} className="expense-item">
                <div>
                  <strong>{expense.expName}</strong> - ${expense.paid} (
                  {expense.category}) <br />
                  <small>Date: {formatDate(expense.createdAt)}</small>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteExpense(expense._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
