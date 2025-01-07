import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div className="w-full bg-blue-400">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl text-white">Banking App</h1>
              <nav>
                <ul className="flex space-x-6 text-white">
                  <li>
                    <Link 
                      to="/" 
                      className="hover:text-blue-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/transactions" 
                      className="hover:text-blue-100 transition-colors"
                    >
                      Transactions
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/customers" 
                      className="hover:text-blue-100 transition-colors"
                    >
                      Customers
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/customers" element={<CustomersPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}