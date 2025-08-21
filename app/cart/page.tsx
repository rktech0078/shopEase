'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from '@/components/ui/Loader';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading your cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6">
          <ShoppingBag size={72} className="mx-auto text-gray-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Your cart is empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Looks like you haven’t added anything yet. Browse our products and find something you’ll love!
        </p>
        <Link href="/products">
          <Button size="lg" className="px-8 py-4 text-lg rounded-full">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
        Your Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Header row */}
              <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => {
                  const itemPrice = item.product.discount
                    ? item.product.price - (item.product.price * item.product.discount) / 100
                    : item.product.price;
                  const itemTotalPrice = itemPrice * item.quantity;

                  return (
                    <div key={item.product._id} className="py-5 md:py-6">
                      <div className="md:grid md:grid-cols-5 flex flex-col gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-2 flex items-center gap-4 w-full">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                            {item.product.images?.length > 0 ? (
                              <Image
                                src={urlFor(item.product.images[0]).url()}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              <Link
                                href={`/products/${item.product.slug.current}`}
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            {item.product.categories?.length > 0 && (
                              <p className="text-sm text-gray-500">{item.product.categories[0].name}</p>
                            )}
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="mt-1 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center">
                          {item.product.discount ? (
                            <div>
                              <span className="font-semibold">{formatPrice(itemPrice)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(item.product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold">{formatPrice(item.product.price)}</span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 py-2 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="font-semibold">{formatPrice(itemTotalPrice)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          {/* Desktop sticky card */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-md sticky top-20">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <SummaryContent totalPrice={totalPrice} />
            </div>
          </div>

          {/* Mobile collapsible summary */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow px-4 py-3 font-semibold"
            >
              <span>Order Summary</span>
              <ChevronDown className={`transition-transform ${showSummary ? 'rotate-180' : ''}`} />
            </button>
            {showSummary && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mt-2 p-4">
                <SummaryContent totalPrice={totalPrice} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted summary content for reuse
function SummaryContent({ totalPrice }: { totalPrice: number }) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3 grid ">
        <Link href="/checkout">
          <Button className="w-full py-5 text-lg rounded-full">Proceed to Checkout</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="w-full py-5 rounded-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </>
  );
}
