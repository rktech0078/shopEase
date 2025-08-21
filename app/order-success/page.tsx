'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading order details..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="mb-6">
          <CheckCircle size={64} className="mx-auto text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your order <span className="font-semibold">{orderId}</span> has been placed successfully.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We've sent a confirmation email with your order details.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/products">
            <Button className="w-full" variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}