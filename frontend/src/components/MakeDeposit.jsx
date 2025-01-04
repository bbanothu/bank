import { useState } from 'react';
import { makeDeposit } from '../api/api';

export default function MakeDeposit({ customers, onSuccess, onError }) {
  const [deposit, setDeposit] = useState({ accountId: '', amount: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(deposit.amount);
    
    if (amount <= 0) {
      onError('Deposit amount must be greater than 0');
      return;
    }

    try {
      await makeDeposit(deposit.accountId, amount);
      setDeposit({ accountId: '', amount: '' });
      onSuccess();
    } catch (err) {
      onError('Failed to make deposit');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Deposit Money</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account</label>
          <select
            value={deposit.accountId}
            onChange={(e) => setDeposit({ ...deposit, accountId: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Account</option>
            {customers.map(customer =>
              customer.accounts.map(account => (
                <option key={account.id} value={account.id}>
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
            value={deposit.amount}
            onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
        >
          Make Deposit
        </button>
      </form>
    </div>
  );
}