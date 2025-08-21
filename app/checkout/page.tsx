'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { Check, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';
import { createOrder } from '@/sanity/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'cash_on_delivery',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Preparing checkout..." />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('confirmation');
  };

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);

      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
        finalPrice: item.product.discount
          ? (item.product.price - (item.product.price * item.product.discount / 100)) * item.quantity
          : item.product.price * item.quantity,
        productImage: item.product.images[0],
      }));

      const orderData = {
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: orderItems,
        totalAmount: totalPrice + totalPrice * 0.1,
        status: 'pending',
        paymentMethod:
          formData.paymentMethod === 'cash_on_delivery'
            ? 'cod'
            : formData.paymentMethod === 'credit_card'
            ? 'credit_card'
            : 'bank_transfer',
        paymentStatus:
          formData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'processing',
        createdAt: new Date().toISOString(),
        notes: '',
      };

      const result = await createOrder(orderData);

      if (!result) throw new Error('Failed to create order');

      setOrderSuccess(true);
      setOrderId(result.orderId);
      clearCart();
      toast.success('Order placed successfully! Check your email for confirmation.');

      setTimeout(() => {
        router.push(`/order-success?id=${result.orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add items to your cart before checking out.
        </p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center md:text-left mb-10">Checkout</h1>

      {/* 🔹 Stepper */}
      <div className="flex justify-between items-center mb-10 relative">
        {['shipping', 'payment', 'confirmation'].map((step, index) => (
          <div key={step} className="flex-1 flex items-center relative">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                currentStep === step ||
                (step === 'payment' && currentStep === 'confirmation')
                  ? 'bg-blue-600 text-white border-blue-600 scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border-gray-400'
              }`}
            >
              {currentStep === step ||
              (step === 'payment' && currentStep === 'confirmation') ||
              (step === 'confirmation' && index === 2) ? (
                <Check size={18} />
              ) : (
                index + 1
              )}
            </div>
            {index < 2 && (
              <div className="flex-1 h-[2px] bg-gray-300 dark:bg-gray-600 mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🔹 Main Form Section */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          {currentStep === 'shipping' && (
            <>
              <div className="flex items-center mb-6">
                <Truck size={22} className="mr-2 text-blue-600" />
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              <form onSubmit={handleSubmitShipping} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text' },
                  { id: 'email', label: 'Email', type: 'email' },
                  { id: 'phone', label: 'Phone', type: 'tel' },
                  { id: 'address', label: 'Address', type: 'text', col: 2 },
                  { id: 'city', label: 'City', type: 'text' },
                  { id: 'state', label: 'State', type: 'text' },
                  { id: 'zipCode', label: 'ZIP Code', type: 'text' },
                ].map(({ id, label, type, col }) => (
                  <div key={id} className={col === 2 ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type={type}
                      name={id}
                      value={(formData as any)[id]}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 mt-6 flex justify-end">
                  <Button type="submit" size="lg">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <>
              <div className="flex items-center mb-6">
                <CreditCard size={22} className="mr-2 text-blue-600" />
                <h2 className="text-xl font-bold">Payment Information</h2>
              </div>
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Payment Method Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'cash_on_delivery', label: 'Cash on Delivery' },
                    { id: 'credit_card', label: 'Credit Card' },
                    { id: 'bank_transfer', label: 'Bank Transfer' },
                  ].map(method => (
                    <div
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
                        formData.paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <p className="font-medium">{method.label}</p>
                    </div>
                  ))}
                </div>

                {/* Card Fields */}
                {formData.paymentMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'cardNumber', label: 'Card Number', placeholder: '1234 5678 9012 3456', col: 2 },
                      { id: 'cardName', label: 'Name on Card' },
                      { id: 'expiryDate', label: 'Expiry (MM/YY)' },
                      { id: 'cvv', label: 'CVV' },
                    ].map(({ id, label, placeholder, col }) => (
                      <div key={id} className={col === 2 ? 'md:col-span-2' : ''}>
                        <label className="block text-sm mb-1">{label}</label>
                        <input
                          type="text"
                          name={id}
                          placeholder={placeholder}
                          value={(formData as any)[id]}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep('shipping')}>
                    Back
                  </Button>
                  <Button type="submit">Review Order</Button>
                </div>
              </form>
            </>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Order Confirmation</h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">{formData.fullName}</p>
                <p>{formData.address}, {formData.city}, {formData.state}</p>
                <p>{formData.email} | {formData.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">Payment: {formData.paymentMethod.replace('_',' ')}</p>
              </div>
              <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          )}
        </div>

        {/* 🔹 Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="max-h-56 overflow-y-auto space-y-3">
                {cartItems.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span>{item.quantity} × {item.product.name}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatPrice(totalPrice * 0.1)}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(totalPrice + totalPrice * 0.1)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
