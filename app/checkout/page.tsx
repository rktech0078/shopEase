'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, ShoppingCart, User, Mail, Phone, MapPin,
  CreditCard, Truck, CheckCircle, Lock, Shield, Clock
} from 'lucide-react';

// Enhanced Icon Component
const Icon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    ArrowLeft: <ArrowLeft size={size} />,
    ShoppingCart: <ShoppingCart size={size} />,
    User: <User size={size} />,
    Mail: <Mail size={size} />,
    Phone: <Phone size={size} />,
    MapPin: <MapPin size={size} />,
    CreditCard: <CreditCard size={size} />,
    Truck: <Truck size={size} />,
    CheckCircle: <CheckCircle size={size} />,
    Lock: <Lock size={size} />,
    Shield: <Shield size={size} />,
    Clock: <Clock size={size} />,
  };
  return <span className={className}>{icons[name]}</span>;
};

// Enhanced Utility Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);
};

// Enhanced Form Validation
const validateForm = (formData: any) => {
  const errors: Record<string, string> = {};

  if (!formData.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!formData.email?.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
  if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state?.trim()) errors.state = 'State is required';
  if (!formData.zipCode?.trim()) errors.zipCode = 'ZIP code is required';

  return errors;
};

// Enhanced UI Components
const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false, size = 'md' }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
  };
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">{icon}</span>
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-offset-0 ${icon ? 'pl-10' : ''
          } ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 3
}: {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-offset-0 resize-none ${error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        } bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
    />
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-offset-0 ${error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        } bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

// Main Component
export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, subtotal, tax, shipping, discount, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod',
    notes: ''
  });

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
  ];

  const states = [
    'Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan',
    'Gilgit-Baltistan', 'Azad Kashmir'
  ];

  const paymentMethods = [
    { value: 'cod', label: 'Cash on Delivery' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate form
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error('Please fill in all required fields correctly');
        return;
      }

      setSubmitting(true);
      console.log('Starting order placement...');

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
        finalPrice: item.product.discount
          ? item.product.price - (item.product.price * item.product.discount / 100)
          : item.product.price,
        productImage: item.product.images[0]
      }));

      // Prepare order data
      const orderData = {
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        items: orderItems,
        totalAmount: totalPrice,
        status: 'pending' as const,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        notes: formData.notes
      };

      console.log('Order data prepared:', orderData);
      toast.success('Creating your order...');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      console.log('Order created successfully:', result.order);
      setOrderSuccess(true);
      setOrderId(result.order.orderId);
      clearCart();
      toast.success('Order placed successfully! Check your email for confirmation.');

      setTimeout(() => {
        router.push(`/order-success?id=${result.order.orderId}`);
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      toast.error(`Order failed: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Icon name="ShoppingCart" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to your cart before checkout.</p>
          <Button onClick={() => router.push('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your order has been confirmed and is being processed.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Order ID: <span className="font-mono font-semibold">{orderId}</span></p>
          <div className="animate-pulse">
            <p className="text-sm text-blue-600 dark:text-blue-400">Redirecting to order confirmation...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/cart')}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icon name="ArrowLeft" className="h-5 w-5 mr-2" />
                Back to Cart
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Complete your purchase</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Shield" className="h-4 w-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="User" className="h-5 w-5 text-blue-600" />
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={formErrors.fullName}
                  required
                  icon={<Icon name="User" className="h-4 w-4" />}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  required
                  icon={<Icon name="Mail" className="h-4 w-4" />}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  required
                  icon={<Icon name="Phone" className="h-4 w-4" />}
                />

                <Input
                  label="ZIP Code"
                  name="zipCode"
                  placeholder="Enter ZIP code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  error={formErrors.zipCode}
                  required
                />
              </div>

              <TextArea
                label="Address"
                name="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleInputChange}
                error={formErrors.address}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  options={cities.map(city => ({ value: city, label: city }))}
                  error={formErrors.city}
                  required
                />

                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={states.map(state => ({ value: state, label: state }))}
                  error={formErrors.state}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="CreditCard" className="h-5 w-5 text-blue-600" />
                Payment & Delivery
              </h2>

              <div className="space-y-6">
                <Select
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  options={paymentMethods}
                  required
                />

                <TextArea
                  label="Order Notes (Optional)"
                  name="notes"
                  placeholder="Any special instructions or notes for your order..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="ShoppingCart" className="h-5 w-5 text-blue-600" />
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Icon name="Package" className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{item.product.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {formatPrice(item.product.discount
                          ? (item.product.price - (item.product.price * item.product.discount / 100)) * item.quantity
                          : item.product.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>

                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="text-gray-900 dark:text-white">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-6 !py-3"
                size="lg"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-2 border-t-white border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Icon name="Lock" className="h-4 w-4" />
                    Place Order Securely
                  </div>
                )}
              </Button>

              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 leading-none">
                  <Icon name="Shield" className="h-2 w-2 flex-shrink-0" />
                  <span className="align-middle">Secure checkout powered by ShopEase</span>
                </div>
              </div>


            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
