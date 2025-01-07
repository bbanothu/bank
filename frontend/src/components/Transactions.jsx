import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function TransactionTable({ transactions }) {
  const [sort, setSort] = useState({
    field: 'date',
    direction: 'desc'
  });

  const getSortedTransactions = () => {
    return [...transactions].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'date':
          return direction * (new Date(a.date) - new Date(b.date));
        case 'from':
          return direction * (a.from.customer.localeCompare(b.from.customer));
        case 'to':
          return direction * (a.to.customer.localeCompare(b.to.customer));
        case 'amount':
          return direction * (a.amount - b.amount);
        default:
          return 0;
      }
    });
  };

  const toggleSort = (field) => {
    setSort(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field) => {
    if (sort.field !== field) return <ArrowUpDown size={16} className="text-gray-400" />;
    if (sort.direction === 'asc') return <ArrowUp size={16} />;
    return <ArrowDown size={16} />;
  };

  const SortableHeader = ({ field, children }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <button 
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 hover:text-gray-700 w-full"
        style={{ justifyContent: field === 'amount' ? 'flex-end' : 'flex-start' }}
      >
        {field !== 'amount' && getSortIcon(field)}
        {children}
        {field === 'amount' && getSortIcon(field)}
      </button>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-4">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="from">From</SortableHeader>
              <SortableHeader field="to">To</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getSortedTransactions().map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {transaction.from.customer}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.from.account}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {transaction.to.customer}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.to.account}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}