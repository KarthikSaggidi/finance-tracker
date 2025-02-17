"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend, ResponsiveContainer } from "recharts";

export default function Home() {
  // States for transactions and inputs
  const [transactions, setTransactions] = useState([]);
  const [transactionAmount, setTransactionAmount] = useState(""); // separate state for transaction amount
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [clearDate, setClearDate] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy"); // Date format state
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Others",
  ]);

  const [categoryBudgets, setCategoryBudgets] = useState({
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Health: 0,
    Others: 0,
  });

  const [currentSection, setCurrentSection] = useState("home"); // Track current section
  
  const [category, setCategory] = useState(""); // New state for selected category
  const [predefinedAmount, setPredefinedAmount] = useState(0); // State for predefined amount
  
  const [budgetAmount, setBudgetAmount] = useState(0); // New state to track the total budget
  const [budgetAmountInput, setBudgetAmountInput] = useState(""); // State for budget input textbox

  // Function to handle transaction form submission
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!transactionAmount || !description || !date || !category) return; // Ensure category is selected

    const formattedDate = formatDate(new Date(date)); // Format the date before adding it

    const newTransaction = {
      amount: parseFloat(transactionAmount),
      description,
      date: new Date(date),
      category,
    };
    setTransactions([...transactions, newTransaction]);

    // Update category budgets based on the transaction category
    setCategoryBudgets((prevState) => ({
      ...prevState,
      [category]: prevState[category] + parseFloat(transactionAmount),
    }));

    // Reset form fields after submission
    setTransactionAmount("");
    setDescription("");
    setDate("");
    setCategory(""); // Reset selected category
  };

  // Function to clear transactions for a specific date
  const clearTransactions = () => {
    // Ensure the input date is not empty
    if (!clearDate) return;

    const formattedClearDate = formatDate(new Date(clearDate)); // Get the formatted date
    
    // Check if there are transactions for the specified date
    const transactionsForDate = transactions.filter(
      (transaction) => formatDate(transaction.date) === formattedClearDate
    );

    // If no transactions for the given date, show a popup
    if (transactionsForDate.length === 0) {
      setPopupMessage("No transactions found for the selected date.");
      setTimeout(() => setPopupMessage(""), 3000); // Hide popup after 3 seconds
      return; // Exit the function if no transactions are found
    }

    // Filter out transactions that do not match the selected date
    const updatedTransactions = transactions.filter(
      (transaction) => formatDate(transaction.date) !== formattedClearDate
    );

    // Update the transactions state
    setTransactions(updatedTransactions);
    setClearDate(""); // Reset date input

    setPopupMessage("Transactions cleared successfully!"); // Show success popup
    setTimeout(() => setPopupMessage(""), 3000); // Hide popup after 3 seconds
  };

  // Function to update the total budget with a positive amount
  const handleBudgetUpdate = () => {
    const newAmount = parseFloat(budgetAmountInput);
    if (newAmount > 0) {
      setBudgetAmount(budgetAmount + newAmount); // Add to total budget
    } else {
      alert("Please enter a positive number.");
    }
    setBudgetAmountInput(""); // Clear the amount field after update
  };

  // Function to format date based on selected format
  const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();

    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;

    if (dateFormat === "dd/mm/yyyy") {
      return `${day}/${month}/${year}`;
    } else if (dateFormat === "mm/dd/yyyy") {
      return `${month}/${day}/${year}`;
    } else if (dateFormat === "yyyy-mm-dd") {
      return `${year}-${month}-${day}`;
    }
    return `${day}/${month}/${year}`; // Default to dd/mm/yyyy if format is not found
  };

  // Process data for pie chart
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category || "Others";
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE"];

  const totalExpenses = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const budgetComparisonData = categories.map((category) => {
    return {
      category,
      budget: categoryBudgets[category] || 0,
      actual: categoryData[category] || 0,
    };
  });

  const remainingBudget = budgetAmount - totalExpenses;

  // Process data for the bar chart based on monthly expenses
  const getMonthlyData = () => {
    const monthlyExpenses = {};

    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth() + 1; // Get the month (1-indexed)
      const year = transaction.date.getFullYear();
      const monthKey = `${year}-${month < 10 ? `0${month}` : month}`;

      monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + transaction.amount;
    });

    return Object.entries(monthlyExpenses).map(([month, amount]) => ({
      month,
      amount,
    }));
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 w-full fixed top-0 left-0 z-10 shadow-lg">
        <ul className="flex justify-center space-x-6 mx-10">
          <li
            className="cursor-pointer hover:text-yellow-300 transition-all"
            onClick={() => setCurrentSection("home")}
          >
            Home
          </li>
          <li
            className="cursor-pointer hover:text-yellow-300 transition-all"
            onClick={() => setCurrentSection("history")}
          >
            History
          </li>
          <li
            className="cursor-pointer hover:text-yellow-300 transition-all"
            onClick={() => setCurrentSection("about")}
          >
            About
          </li>
          <li
            className="cursor-pointer hover:text-yellow-300 transition-all"
            onClick={() => setCurrentSection("settings")}
          >
            Settings
          </li>
        </ul>
      </nav>

      {/* Conditional Sections Display Based on currentSection */}
      <div className="mt-24 w-full max-w-4xl flex flex-col items-center">
        {currentSection === "home" && (
          <div className="w-full flex flex-col items-center">
            {/* Budget Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6 max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Budget Summary</h2>
              <div className="mb-4">
                <h3 className="text-lg">Total Budget</h3>
                <p className="text-lg">₹{budgetAmount}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg">Remaining Budget</h3>
                <p className="text-lg">₹{remainingBudget}</p>
              </div>
              <div>
                <h3 className="text-lg">Total Expenses</h3>
                <p className="text-lg">₹{totalExpenses}</p>
              </div>

              {/* Textbox and Button to Add Money to Total Budget */}
              <div className="mt-4">
                <input
                  type="number"
                  value={budgetAmountInput}
                  onChange={(e) => setBudgetAmountInput(e.target.value)}
                  placeholder="Enter budget amount"
                  className="p-2 border rounded w-full"
                />
                <button
                  onClick={handleBudgetUpdate}
                  className="bg-blue-500 text-white p-2 rounded mt-2 w-full hover:bg-blue-600 mt-4"
                >
                  Add to Budget
                </button>
              </div>
            </div>

            {/* Transaction Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6 max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Add a Transaction</h2>
              <form onSubmit={handleAddTransaction} className="flex flex-col space-y-4">
                <input
                  type="number"
                  value={transactionAmount} // this state is only for the transaction form
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Amount (₹)"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border rounded"
                  required
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
                >
                  Add Transaction
                </button>
              </form>
            </div>

            {/* Category Breakdown Table Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6 max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Category Breakdown</h2>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category}>
                      <td className="px-4 py-2 border">{category}</td>
                      <td className="px-4 py-2 border">₹{categoryBudgets[category] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pie Chart Section */}
            <div className="mb-8">
              <PieChart width={400} height={400}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            
          </div>
        )}

        {/* History Section */}
        {currentSection === "history" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Transaction History</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500">No transactions added yet.</p>
              ) : (
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Amount</th>
                      <th className="px-4 py-2 border">Description</th>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{transaction.amount}</td>
                        <td className="px-4 py-2 border">{transaction.description}</td>
                        <td className="px-4 py-2 border">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-2 border">{transaction.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* About Section */}
        {currentSection === "about" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">About</h2>
            <p>This application allows you to manage your personal finances by tracking your income and expenses.</p>
            <p>Features include transaction tracking, category budgeting, and pie chart visualizations for better insights.</p>
            <p>Version 1.0</p>
          </div>
        )}

               {/* Settings Section */}
        {currentSection === "settings" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Settings</h2>
            {/* Currency Selection */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold">Select Currency</h3>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="INR">INR (Indian Rupee)</option>
        <option value="USD">USD (United States Dollar)</option>
        <option value="EUR">EUR (Euro)</option>
        <option value="GBP">GBP (British Pound)</option>
        <option value="AUD">AUD (Australian Dollar)</option>
        {/* Add more currencies if needed */}
      </select>
    </div>
            
            {/* Date Format Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Select Date Format</h3>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
              </select>
            </div>

            {/* Enable Notifications */}
            <div className="flex items-center mb-6">
              <label className="mr-2">Enable Notifications</label>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </div>

            {/* Clear Transactions Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Clear Transactions for a Specific Date</h3>
              <input
                type="date"
                value={clearDate}
                onChange={(e) => setClearDate(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={clearTransactions}
                className="bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
              >
                Clear Transactions
              </button>
            </div>

            {popupMessage && (
              <div
                className={`bg-green-500 text-white p-3 rounded mt-4 text-center`}
                style={{
                  backgroundColor: popupMessage === "Transactions cleared successfully!" ? "green" : "red",
                }}
              >
                {popupMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}