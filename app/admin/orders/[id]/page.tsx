'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, CreditCard, MapPin, Package, User } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      fetchOrderDetails();
    } else {
      router.push('/admin');
    }
  }, []);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderId = params.id;
      
      const query = groq`*[_type == "order" && orderId == $orderId][0]{
        _id,
        _createdAt,
        orderId,
        customer,
        items,
        totalAmount,
        status,
        paymentMethod,
        paymentStatus,
        createdAt,
        notes
      }`;
      
      const data = await client.fetch<Order>(query, { orderId });
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!order?._id) return;
      
      await client
        .patch(order._id)
        .set({ status: newStatus })
        .commit();
      
      setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    try {
      if (!order?._id) return;
      
      await client
        .patch(order._id)
        .set({ paymentStatus: newStatus })
        .commit();
      
      setOrder(prev => prev ? { ...prev, paymentStatus: newStatus as any } : null);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading order details..." />
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to login in useEffect
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/admin')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Order {order.orderId}</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            <Calendar className="inline mr-1 h-4 w-4" />
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <User size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold">Customer</h2>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{order.customer.fullName}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <MapPin size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold">Shipping Address</h2>
            </div>
            <div className="space-y-1">
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CreditCard size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold">Payment</h2>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Method: </span>
                {order.paymentMethod === 'credit_card' ? 'Credit Card' : 
                 order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
              </p>
              <p>
                <span className="font-medium">Status: </span>
                <select 
                  value={order.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="ml-2 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </p>
              <p>
                <span className="font-medium">Total: </span>
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold">Order Status</h2>
            </div>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div 
                style={{ 
                  width: 
                    order.status === 'pending' ? '20%' : 
                    order.status === 'processing' ? '40%' : 
                    order.status === 'shipped' ? '60%' : 
                    order.status === 'delivered' ? '100%' : 
                    order.status === 'cancelled' ? '100%' : '0%' 
                }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                  ${order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className={order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'font-bold' : ''}>Pending</span>
              <span className={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'font-bold' : ''}>Processing</span>
              <span className={order.status === 'shipped' || order.status === 'delivered' ? 'font-bold' : ''}>Shipped</span>
              <span className={order.status === 'delivered' ? 'font-bold' : ''}>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.productImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <Image 
                              src={urlFor(item.productImage).url()} 
                              alt={item.productName}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {item.productId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.discount ? `${item.discount}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatPrice(item.finalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={4} className="px-6 py-4 text-sm font-medium text-right">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Notes</h2>
            <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}