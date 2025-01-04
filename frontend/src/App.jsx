import { useState, useEffect } from 'react';
import { getCustomers } from './api/api';
import CreateCustomer from './components/CreateCustomer';
import CreateAccount from './components/CreateAccount';
import MakeTransfer from './components/MakeTransfer';
import MakeDeposit from './components/MakeDeposit';
import CustomerTable from './components/CustomerTable';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ErrorMessage error={error} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CreateCustomer 
          onSuccess={fetchCustomers} 
          onError={setError} 
        />
        <CreateAccount 
          customers={customers} 
          onSuccess={fetchCustomers} 
          onError={setError} 
        />
        <MakeTransfer 
          customers={customers} 
          onSuccess={fetchCustomers} 
          onError={setError} 
        />
        <MakeDeposit 
          customers={customers} 
          onSuccess={fetchCustomers} 
          onError={setError} 
        />
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}