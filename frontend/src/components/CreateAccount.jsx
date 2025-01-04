import { useState } from 'react';
import { createAccount } from '../api/api';

export default function CreateAccount({ customers, onSuccess, onError }) {
  const [account, setAccount] = useState({ customerId: '', initialDeposit: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deposit = parseFloat(account.initialDeposit);
    if (deposit <= 0) {
      onError('Initial deposit must be greater than 0');
      return;
    }
    try {
      await createAccount({
        customerId: parseInt(account.customerId),
        initialDeposit: deposit
      });
      setAccount({ customerId: '', initialDeposit: '' });
      onSuccess();
    } catch (err) {
      onError('Failed to create account');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            value={account.customerId}
            onChange={(e) => setAccount({ ...account, customerId: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Deposit</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={account.initialDeposit}
            onChange={(e) => setAccount({ ...account, initialDeposit: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}