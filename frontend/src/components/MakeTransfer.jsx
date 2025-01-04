import { useState } from 'react';
import { makeTransfer } from '../api/api';

export default function MakeTransfer({ customers, onSuccess, onError }) {
  const [transfer, setTransfer] = useState({ fromAccountId: '', toAccountId: '', amount: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transfer.amount);
    
    if (amount <= 0) {
      onError('Transfer amount must be greater than 0');
      return;
    }

    if (transfer.fromAccountId === transfer.toAccountId) {
      onError('Cannot transfer to the same account');
      return;
    }

    try {
      await makeTransfer({
        fromAccountId: parseInt(transfer.fromAccountId),
        toAccountId: parseInt(transfer.toAccountId),
        amount: amount
      });
      setTransfer({ fromAccountId: '', toAccountId: '', amount: '' });
      onSuccess();
    } catch (err) {
      onError('Failed to make transfer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Make Transfer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Account</label>
          <select
            value={transfer.fromAccountId}
            onChange={(e) => setTransfer({ ...transfer, fromAccountId: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Account</option>
            {customers.map(customer =>
              customer.accounts.map(account => (
                <option
                  key={account.id}
                  value={account.id}
                  disabled={account.id === parseInt(transfer.toAccountId)}
                >
                  {customer.name} - {account.accountNumber} (${account.balance})
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Account</label>
          <select
            value={transfer.toAccountId}
            onChange={(e) => setTransfer({ ...transfer, toAccountId: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Account</option>
            {customers.map(customer =>
              customer.accounts.map(account => (
                <option
                  key={account.id}
                  value={account.id}
                  disabled={account.id === parseInt(transfer.fromAccountId)}
                >
                  {customer.name} - {account.accountNumber} (${account.balance})
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={transfer.amount}
            onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Make Transfer
        </button>
      </form>
    </div>
  );
}