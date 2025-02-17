// src/app/components/TransactionForm.js
import { useState } from 'react';

export default function TransactionForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = { amount, description, date };
    onAdd(newTransaction);
    setAmount('');
    setDescription('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        Add Transaction
      </button>
    </form>
  );
}