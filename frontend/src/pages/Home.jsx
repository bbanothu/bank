import { useState, useEffect } from 'react';
import { getCustomers, getTransactions } from '../api/api';
import CreateCustomer from '../components/CreateCustomer';
import CreateAccount from '../components/CreateAccount';
import MakeTransfer from '../components/MakeTransfer';
import MakeDeposit from '../components/MakeDeposit';
import CustomerTable from '../components/CustomerTable';
import Transactions from '../components/Transactions';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchTransactions();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers');
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions');
    }
  };

  const handleSuccess = () => {
    fetchCustomers();
    fetchTransactions();
  };

  return (
    <div className='p-6'>
      <ErrorMessage error={error} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CreateCustomer 
          onSuccess={handleSuccess}
          onError={setError}
        />
        <CreateAccount 
          customers={customers}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <MakeTransfer 
          customers={customers}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <MakeDeposit 
          customers={customers}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <CustomerTable 
          customers={customers}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <Transactions transactions={transactions} />
      </div>
    </div>
  );
}