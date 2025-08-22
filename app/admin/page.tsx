'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrders } from '@/sanity/lib/api';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  LayoutDashboard, Package, Settings, LogOut, Search, RefreshCw, Eye, 
  Menu, X, DollarSign, Clock, TrendingUp, Users, ShoppingCart,
  Filter, MoreVertical, CheckCircle, XCircle, Truck, AlertCircle
} from 'lucide-react';

// Enhanced Icon Component
const Icon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    LayoutDashboard: <LayoutDashboard size={size} />,
    Package: <Package size={size} />,
    Settings: <Settings size={size} />,
    LogOut: <LogOut size={size} />,
    Search: <Search size={size} />,
    RefreshCw: <RefreshCw size={size} />,
    Eye: <Eye size={size} />,
    Menu: <Menu size={size} />,
    X: <X size={size} />,
    DollarSign: <DollarSign size={size} />,
    Clock: <Clock size={size} />,
    TrendingUp: <TrendingUp size={size} />,
    Users: <Users size={size} />,
    ShoppingCart: <ShoppingCart size={size} />,
    Filter: <Filter size={size} />,
    MoreVertical: <MoreVertical size={size} />,
    CheckCircle: <CheckCircle size={size} />,
    XCircle: <XCircle size={size} />,
    Truck: <Truck size={size} />,
    AlertCircle: <AlertCircle size={size} />,
  };
  
  const icon = icons[name];
  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return <span className={className}>?</span>;
  }
  
  return <span className={className}>{icon}</span>;
};

// Enhanced Utility Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClasses = (status: string): string => {
  const base = "px-3 py-1.5 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-2";
  switch (status) {
    case 'pending': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
    case 'processing': return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
    case 'shipped': return `${base} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300`;
    case 'delivered': return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
    case 'cancelled': return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
    default: return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock size={14} />;
    case 'processing': return <Package size={14} />;
    case 'shipped': return <Truck size={14} />;
    case 'delivered': return <CheckCircle size={14} />;
    case 'cancelled': return <XCircle size={14} />;
    default: return <AlertCircle size={14} />;
  }
};

// Enhanced UI Components
const Loader = ({ size = 'large', text = 'Loading...' }: { size?: 'small' | 'large'; text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-blue-600 ${size === 'large' ? 'h-16 w-16' : 'h-8 w-8'}`}></div>
    <p className="text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false, size = 'md' }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
  };
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

// Enhanced Sub-components
const LoginForm = ({ onLogin, error, loading }: { 
  onLogin: (e: React.FormEvent<Element>) => void; 
  error: string; 
  loading: boolean; 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="LayoutDashboard" className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Please sign in.</p>
      </div>
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}
      <form className="space-y-6" onSubmit={onLogin}>
        <div className="space-y-4">
          <input 
            name="username" 
            type="text" 
            required 
            placeholder="Username" 
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all" 
          />
          <input 
            name="password" 
            type="password" 
            required 
            placeholder="Password" 
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all" 
          />
        </div>
        <Button type="submit" className="w-full !py-3 !mt-8" disabled={loading}>
          {loading ? <Loader size="small" text="Signing in..." /> : 'Sign In'}
        </Button>
      </form>
    </motion.div>
  </div>
);

const Sidebar = ({ onLogout, isOpen, setIsOpen }: { 
  onLogout: () => void; 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
}) => (
  <>
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Icon name="LayoutDashboard" className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">ShopEase</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <Icon name="X" className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/30 rounded-lg font-semibold border-l-4 border-blue-500">
            <Icon name="Package" className="h-5 w-5" /> Orders
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Icon name="Users" className="h-5 w-5" /> Customers
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Icon name="ShoppingCart" className="h-5 w-5" /> Products
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Icon name="TrendingUp" className="h-5 w-5" /> Analytics
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Icon name="Settings" className="h-5 w-5" /> Settings
          </a>
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
          <Icon name="LogOut" className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
    {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}
  </>
);

const StatCard = ({ title, value, icon, color, trend }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    whileHover={{ scale: 1.02, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
    </div>
  </motion.div>
);

// Enhanced Order Actions Component
const OrderActions = ({ order, onStatusUpdate }: { order: Order; onStatusUpdate: (orderId: string, status: string) => void }) => {
  const [showActions, setShowActions] = useState(false);
  
  const statusOptions = [
    { value: 'pending', label: 'Mark Pending', icon: <Clock size={16} /> },
    { value: 'processing', label: 'Mark Processing', icon: <Package size={16} /> },
    { value: 'shipped', label: 'Mark Shipped', icon: <Truck size={16} /> },
    { value: 'delivered', label: 'Mark Delivered', icon: <CheckCircle size={16} /> },
    { value: 'cancelled', label: 'Cancel Order', icon: <XCircle size={16} />, variant: 'danger' as const },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowActions(!showActions)}
        className="relative"
      >
        <Icon name="MoreVertical" className="h-4 w-4" />
      </Button>
      
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-2 space-y-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStatusUpdate(order._id!, option.value);
                    setShowActions(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    option.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
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
      console.log('Fetching orders from Sanity...');
      const data = await getOrders();
      console.log('Orders fetched successfully:', data);
      setOrders(data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      setError(`Error: ${errorMessage}`);
      toast.error('Failed to fetch orders. Please check your Sanity configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Here you would typically call an API to update the order status
      // For now, we'll just update the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
      
      // TODO: Send email notification to customer
      // TODO: Update order in Sanity
      
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleLogin = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    setAuthLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    
    return [
      { 
        title: "Total Revenue", 
        value: formatPrice(totalRevenue), 
        icon: <Icon name="DollarSign" className="h-6 w-6 text-green-600" />, 
        color: "bg-green-100 dark:bg-green-900/50",
        trend: { value: 12, isPositive: true }
      },
      { 
        title: "Total Orders", 
        value: orders.length, 
        icon: <Icon name="Package" className="h-6 w-6 text-blue-600" />, 
        color: "bg-blue-100 dark:bg-blue-900/50",
        trend: { value: 8, isPositive: true }
      },
      { 
        title: "Pending Orders", 
        value: pendingOrders, 
        icon: <Icon name="Clock" className="h-6 w-6 text-yellow-600" />, 
        color: "bg-yellow-100 dark:bg-yellow-900/50" 
      },
      { 
        title: "Processing", 
        value: processingOrders, 
        icon: <Icon name="Package" className="h-6 w-6 text-indigo-600" />, 
        color: "bg-indigo-100 dark:bg-indigo-900/50" 
      },
      { 
        title: "Delivered", 
        value: deliveredOrders, 
        icon: <Icon name="CheckCircle" className="h-6 w-6 text-green-600" />, 
        color: "bg-green-100 dark:bg-green-900/50" 
      },
    ];
  }, [orders]);

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} error={error} loading={authLoading} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="Menu" className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Orders Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all customer orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={fetchOrders} 
              disabled={loading}
              className="hidden sm:inline-flex"
            >
              <Icon name="RefreshCw" className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
              Refresh
            </Button>
            <Button 
              variant="primary" 
              onClick={() => router.push('/admin/analytics')}
              className="hidden sm:inline-flex"
            >
              <Icon name="TrendingUp" className="h-4 w-4 mr-2" /> 
              Analytics
            </Button>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Loader size="large" text="Fetching latest orders..." />
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {/* Enhanced Stat Cards */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8"
            >
              {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </motion.div>

            {/* Enhanced Search & Filters */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, name, or email..."
                    className="pl-11 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Filter" className="h-5 w-5 text-gray-400" />
                  <select
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all"
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
                </div>
              </div>
            </motion.div>

            {/* Enhanced Orders Table */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono text-sm text-gray-900 dark:text-white font-semibold">
                              {order.orderId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="font-semibold text-gray-900 dark:text-white">{order.customer.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatPrice(order.totalAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusClasses(order.status)}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusClasses(order.paymentStatus)}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => router.push(`/admin/orders/${order._id}`)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Icon name="Eye" className="h-4 w-4" />
                              </Button>
                              <OrderActions order={order} onStatusUpdate={handleStatusUpdate} />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Icon name="Package" className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="font-semibold text-lg">No orders found</p>
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
