'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, slug, images, price, discount } = product;
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl =
    images && images.length > 0 && !imageError ? urlFor(images[0]).url() : '';
  const discountedPrice =
    discount && discount > 0 ? price - (price * discount) / 100 : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imageUrl ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            <Image
              src={imageUrl}
              alt={name}
              width={500}
              height={500}
              className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
            />
          </>
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          className="absolute top-3 right-3 rounded-full bg-white/80 p-2 shadow hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart
            size={18}
            className={`${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <Link
            href={`/products/${slug.current}`}
            className="flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
          >
            <ShoppingCart size={16} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          {discountedPrice ? (
            <>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Link
          href={`/products/${slug.current}`}
          className="mt-auto w-full flex justify-center items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
