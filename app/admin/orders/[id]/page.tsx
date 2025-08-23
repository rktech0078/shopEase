'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrderById } from '@/sanity/lib/api';
import { Order } from '@/types';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, Package, User, MapPin, Phone, Mail, Calendar, 
  DollarSign, CreditCard, Truck, CheckCircle, XCircle, Clock,
  Edit, Save, X, Send, AlertCircle
} from 'lucide-react';

// Enhanced Icon Component
const Icon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    ArrowLeft: <ArrowLeft size={size} />,
    Package: <Package size={size} />,
    User: <User size={size} />,
    MapPin: <MapPin size={size} />,
    Phone: <Phone size={size} />,
    Mail: <Mail size={size} />,
    Calendar: <Calendar size={size} />,
    DollarSign: <DollarSign size={size} />,
    CreditCard: <CreditCard size={size} />,
    Truck: <Truck size={size} />,
    CheckCircle: <CheckCircle size={size} />,
    XCircle: <XCircle size={size} />,
    Clock: <Clock size={size} />,
    Edit: <Edit size={size} />,
    Save: <Save size={size} />,
    X: <X size={size} />,
    Send: <Send size={size} />,
    AlertCircle: <AlertCircle size={size} />,
  };
  return <span className={className}>{icons[name]}</span>;
};

// Enhanced Utility Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClasses = (status: string): string => {
  const base = "px-4 py-2 rounded-full text-sm font-semibold capitalize inline-flex items-center gap-2";
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
    case 'pending': return <Clock size={18} />;
    case 'processing': return <Package size={18} />;
    case 'shipped': return <Truck size={18} />;
    case 'delivered': return <CheckCircle size={18} />;
    case 'cancelled': return <XCircle size={18} />;
    default: return <AlertCircle size={18} />;
  }
};

// Enhanced UI Components
const Button = ({ children, onClick, className = '', variant = 'primary', size = 'md', disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
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
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl",
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Loader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-blue-600 border-gray-200 dark:border-gray-600"></div>
    <p className="text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

// Status Update Modal Component
const StatusUpdateModal = ({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onStatusUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onStatusUpdate: (status: string, notes: string) => void;
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Order is placed and waiting' },
    { value: 'processing', label: 'Processing', description: 'Order is being prepared' },
    { value: 'shipped', label: 'Shipped', description: 'Order is on its way' },
    { value: 'delivered', label: 'Delivered', description: 'Order completed successfully' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' },
  ];

  const handleSubmit = async () => {
    if (status === currentStatus && !notes.trim()) {
      onClose();
      return;
    }

    setUpdating(true);
    try {
      await onStatusUpdate(status, notes);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Order Status</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes for the customer..."
                rows={3}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={updating}
              className="flex-1"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Main Component
export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setError('');
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to fetch order details');
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string, notes: string) => {
    try {
      setUpdatingStatus(true);
      
      const response = await fetch('/api/orders/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setOrder(prev => prev ? { ...prev, status: status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled', notes } : null);
        toast.success(`Order status updated to ${status}`);
        
        // Show email notification
        toast.success('Email notification sent to customer');
      } else {
        throw new Error(result.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <Loader text="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Icon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/admin')}>
            <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/admin')}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icon name="ArrowLeft" className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Order #{order.orderId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={getStatusClasses(order.status)}>
                {getStatusIcon(order.status)}
                {order.status}
              </span>
              <Button 
                variant="primary" 
                onClick={() => setShowStatusModal(true)}
                disabled={updatingStatus}
              >
                <Icon name="Edit" className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="Package" className="h-5 w-5 text-blue-600" />
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Icon name="Package" className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                      {item.discount && item.discount > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Discount: {item.discount}% off
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(item.finalPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="text-gray-900 dark:text-white capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                    <span className={getStatusClasses(order.paymentStatus)}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="Clock" className="h-5 w-5 text-blue-600" />
                Order Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Order Processing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order is being prepared</p>
                    </div>
                  </div>
                )}
                
                {['shipped', 'delivered'].includes(order.status) && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Order Shipped</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order is on its way</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Order Delivered</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order completed successfully</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'cancelled' && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Order Cancelled</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order has been cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="User" className="h-5 w-5 text-blue-600" />
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="User" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon name="Mail" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="Package" className="h-5 w-5 text-blue-600" />
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon name="DollarSign" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes:</p>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
             <StatusUpdateModal
         isOpen={showStatusModal}
         onClose={() => setShowStatusModal(false)}
         currentStatus={order.status}
         onStatusUpdate={handleStatusUpdate}
       />
    </div>
  );
}
