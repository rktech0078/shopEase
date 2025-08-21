'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (lucide-react) ---
// In a real project, you would install and import these
// For this example, we'll create simple SVG placeholders
const Icon = ({ name, className }) => {
  const icons = {
    LayoutDashboard: <><path d="M12 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V12" /><path d="M12 3v9h9" /><path d="M16 3h5v5" /></>,
    Package: <><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" /><path d="m7 11 5 3 5-3" /><path d="M12 22V14" /><path d="M22 14a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4Z" /><path d="M2.5 14.5A2.5 2.5 0 0 0 5 17h0" /><path d="M2.5 14.5A2.5 2.5 0 0 1 0 12h0" /></>,
    Settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
    LogOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    Search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    RefreshCw: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></>,
    Eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    Menu: <><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></>,
    X: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    DollarSign: <><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    Clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>;
};


// --- MOCK DATA & API ---
// This simulates fetching data from an API like Sanity
const mockOrders = [
  { _id: '1', orderId: 'ORD-2024-001', customer: { fullName: 'Ali Khan', email: 'ali.khan@example.com' }, createdAt: new Date().toISOString(), totalAmount: 2500, status: 'delivered', paymentStatus: 'paid' },
  { _id: '2', orderId: 'ORD-2024-002', customer: { fullName: 'Fatima Ahmed', email: 'fatima.a@example.com' }, createdAt: new Date(Date.now() - 86400000).toISOString(), totalAmount: 1200, status: 'shipped', paymentStatus: 'paid' },
  { _id: '3', orderId: 'ORD-2024-003', customer: { fullName: 'Bilal Chaudhry', email: 'b.chaudhry@example.com' }, createdAt: new Date(Date.now() - 172800000).toISOString(), totalAmount: 4500, status: 'processing', paymentStatus: 'paid' },
  { _id: '4', orderId: 'ORD-2024-004', customer: { fullName: 'Sana Iqbal', email: 'sana.iqbal@example.com' }, createdAt: new Date(Date.now() - 259200000).toISOString(), totalAmount: 800, status: 'pending', paymentStatus: 'pending' },
  { _id: '5', orderId: 'ORD-2024-005', customer: { fullName: 'Usman Malik', email: 'usman.m@example.com' }, createdAt: new Date(Date.now() - 345600000).toISOString(), totalAmount: 3100, status: 'cancelled', paymentStatus: 'refunded' },
];

const getOrders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 1000);
  });
};

// --- UTILITY FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);
};

// --- UI COMPONENTS ---

const Loader = ({ size = 'large', text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-blue-600 ${size === 'large' ? 'h-16 w-16' : 'h-8 w-8'}`}></div>
    <p className="text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
  };
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

// --- SUB-COMPONENTS for DASHBOARD ---

const LoginForm = ({ onLogin, error, loading }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Please sign in.</p>
      </div>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-lg text-center">
          {error}
        </div>
      )}
      <form className="space-y-6" onSubmit={onLogin}>
        <input name="username" type="text" required placeholder="Username" className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition" />
        <input name="password" type="password" required placeholder="Password" className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition" />
        <Button type="submit" className="w-full !py-3 !mt-8" disabled={loading}>
          {loading ? <Loader size="small" text="Signing in..." /> : 'Sign In'}
        </Button>
      </form>
    </motion.div>
  </div>
);

const Sidebar = ({ onLogout, isOpen, setIsOpen }) => (
  <>
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
          <Icon name="LayoutDashboard" className="h-6 w-6 text-blue-600" /> Admin
        </h2>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white">
          <Icon name="X" className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold">
          <Icon name="Package" className="h-5 w-5" /> Orders
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Icon name="Settings" className="h-5 w-5" /> Settings
        </a>
      </nav>
      <div className="mt-auto">
        <button onClick={onLogout} className="flex w-full items-center gap-3 px-3 py-2 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
          <Icon name="LogOut" className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
    {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}
  </>
);

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-5"
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
  >
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

const getStatusClasses = (status) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold capitalize";
  switch (status) {
    case 'pending': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
    case 'processing': return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
    case 'shipped': return `${base} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300`;
    case 'delivered': return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
    case 'cancelled': return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
    case 'paid': return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
    case 'refunded': return `${base} bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300`;
    default: return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
  }
};

// --- MAIN DASHBOARD COMPONENT ---

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { username, password } = e.target.elements;
    setTimeout(() => { // Simulate network delay
      if (username.value === ADMIN_USERNAME && password.value === ADMIN_PASSWORD) {
        setAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        fetchOrders();
        setError('');
      } else {
        setError('Invalid username or password');
      }
      setAuthLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(lowerSearchTerm) ||
      order.customer.fullName.toLowerCase().includes(lowerSearchTerm) ||
      order.customer.email.toLowerCase().includes(lowerSearchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [orders, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => (order.paymentStatus === 'paid' ? acc + order.totalAmount : acc), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    return [
      { title: "Total Revenue", value: formatPrice(totalRevenue), icon: <Icon name="DollarSign" className="h-6 w-6 text-green-600" />, color: "bg-green-100 dark:bg-green-900/50" },
      { title: "Total Orders", value: orders.length, icon: <Icon name="Package" className="h-6 w-6 text-blue-600" />, color: "bg-blue-100 dark:bg-blue-900/50" },
      { title: "Pending Orders", value: pendingOrders, icon: <Icon name="Clock" className="h-6 w-6 text-yellow-600" />, color: "bg-yellow-100 dark:bg-yellow-900/50" },
    ];
  }, [orders]);

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} error={error} loading={authLoading} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <Icon name="Menu" className="h-6 w-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Orders Dashboard</h1>
          </div>
          <Button variant="outline" onClick={fetchOrders} className="hidden sm:inline-flex" disabled={loading}>
            <Icon name="RefreshCw" className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Loader size="large" text="Fetching latest orders..." />
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {/* Stat Cards */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </motion.div>

            {/* Search & Filters */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, name, or email..."
                  className="pl-11 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </motion.div>

            {/* Orders Table */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Payment', 'Actions'].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredOrders.map(order => (
                        <motion.tr
                          key={order._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{order.orderId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{order.customer.fullName}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{order.customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{formatPrice(order.totalAmount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClasses(order.status)}>{order.status}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClasses(order.paymentStatus)}>{order.paymentStatus}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm">
                              <Icon name="Eye" className="h-4 w-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="font-semibold">No orders found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
