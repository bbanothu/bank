import { useState } from 'react';
import { deleteAccount, deleteCustomer } from '../api/api';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function CustomerTable({ customers, onSuccess, onError }) {
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'asc'
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const handleDeleteAccount = async (accountId, balance) => {
    if (balance > 0) {
      onError('Cannot delete account with non-zero balance');
      return;
    }

    setModalConfig({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete this account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteAccount(accountId);
          onSuccess();
          setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          onError('Failed to delete account');
        }
      }
    });
  };

  const handleDeleteCustomer = async (customer) => {
    const hasBalance = customer.accounts?.some(account => account.balance > 0) || false;
    if (hasBalance) {
      onError('Cannot delete customer with non-zero balance accounts');
      return;
    }

    setModalConfig({
      isOpen: true,
      title: 'Delete Customer',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteCustomer(customer.id);
          onSuccess();
          setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          onError('Failed to delete customer');
        }
      }
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const toggleSort = (field) => {
    setSort(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field) => {
    if (sort.field !== field) return <ArrowUpDown size={16} className="text-gray-400" />;
    return sort.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const SortableHeader = ({ field, children, align = 'left' }) => (
    <th className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      <button 
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 hover:text-gray-700 w-full"
        style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
      >
        {align === 'left' && getSortIcon(field)}
        {children}
        {align === 'right' && getSortIcon(field)}
      </button>
    </th>
  );

  const sortCustomers = () => {
    const allRows = customers.map(customer => {
      if (!customer.accounts || customer.accounts.length === 0) {
        return [{
          customer,
          isFirstAccount: true,
          account: null
        }];
      }
      return customer.accounts.map((account, index) => ({
        customer,
        account,
        isFirstAccount: index === 0
      }));
    }).flat();

    return allRows.sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'name':
          return direction * a.customer.name.localeCompare(b.customer.name);
        case 'email':
          return direction * a.customer.email.localeCompare(b.customer.email);
        case 'accountNumber':
          if (!a.account && !b.account) return 0;
          if (!a.account) return direction;
          if (!b.account) return -direction;
          return direction * a.account.accountNumber.localeCompare(b.account.accountNumber);
        case 'balance':
          if (!a.account && !b.account) return 0;
          if (!a.account) return direction;
          if (!b.account) return -direction;
          return direction * (a.account.balance - b.account.balance);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-4">
      <h2 className="text-xl font-semibold mb-4">Customers & Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="name">Customer Name</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="accountNumber">Account Number</SortableHeader>
              <SortableHeader field="balance" align="right">Balance</SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortCustomers().map((row, index) => (
              <tr 
                key={`${row.customer.id}-${row.account?.id || index}`}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {row.isFirstAccount && (
                      <>
                        <button
                          onClick={() => handleDeleteCustomer(row.customer)}
                          disabled={row.customer.accounts?.some(a => a.balance > 0)}
                          className={`p-1.5 rounded transition-colors ${
                            row.customer.accounts?.some(a => a.balance > 0)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-sm font-medium text-gray-900">
                          {row.customer.name}
                        </div>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.isFirstAccount && (
                    <div className="text-sm text-gray-500">
                      {row.customer.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {row.account ? row.account.accountNumber : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {row.account ? `$${row.account.balance.toFixed(2)}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {row.account && (
                    <button
                      onClick={() => handleDeleteAccount(row.account.id, row.account.balance)}
                      disabled={row.account.balance > 0}
                      className={`p-1.5 rounded transition-colors ${
                        row.account.balance > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={closeModal}
      />
    </div>
  );
}