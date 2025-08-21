'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Loader } from '../../../components/ui/Loader';

import { getProduct } from '../../../sanity/lib/api';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export const dynamic = 'force-dynamic';

interface Category {
  _id: string;
  name: string;
  slug: string | { current: string };
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount?: number;
  inStock?: boolean;
  description?: string;
  features?: string[];
  images?: any[];
  categories?: Category[];
}

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        const productData = await getProduct(slug);
        if (!productData) {
          notFound();
          return;
        }
        if (!cancelled) {
          const transformedProduct = {
            ...productData,
            categories:
              productData.categories?.map((category: any) => ({
                _id: category._ref || category._id,
                name: category.name,
                slug: category.slug || { current: '' },
              })) || [],
          };
          setProduct(transformedProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <Loader size="large" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    notFound();
    return null;
  }

  const safePrice = product?.price ? Number(product.price) : 0;
  const safeDiscount = product?.discount ? Number(product.discount) : 0;
  const finalPrice =
    safeDiscount > 0 ? safePrice - (safePrice * safeDiscount) / 100 : safePrice;

  const handleAddToCart = () => addToCart(product, quantity);
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const images = product?.images ? [...product.images] : [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Images Gallery */}
        <div className="w-full md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md relative group">
            {images.length > 0 ? (
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={urlFor(images[activeImageIndex] ?? images[0]).url()}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={index}
                  className={`relative aspect-square w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                    activeImageIndex === index
                      ? 'border-blue-500 scale-105'
                      : 'border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={urlFor(image).url()}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-6 md:sticky md:top-24 self-start">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {product.name}
          </h1>

          {/* Price */}
          <div>
            {safeDiscount ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(safePrice)}
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                  {safeDiscount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(safePrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.inStock ? (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                In Stock
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Features */}
          {product.features?.length ? (
            <div>
              <h2 className="text-lg font-semibold mb-1">Features</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Quantity Selector */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
            <div className="flex items-center">
              <button
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                disabled={!product.inStock}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                <Minus size={16} />
              </button>
              <div className="px-6 py-2 border-t border-b border-gray-300 dark:border-gray-600 min-w-[3rem] text-center">
                {quantity}
              </div>
              <button
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                disabled={!product.inStock}
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full py-3 flex items-center justify-center gap-2 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </Button>

          {/* Categories */}
          {product.categories?.length ? (
            <div>
              <h2 className="text-sm font-medium mb-2">Categories:</h2>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => {
                  const slugValue =
                    typeof category.slug === 'string'
                      ? category.slug
                      : category.slug?.current ?? '';
                  return (
                    <a
                      key={category._id}
                      href={`/products?category=${slugValue}`}
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {category.name}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
