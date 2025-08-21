'use client';

import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '@/sanity/lib/api';
import ProductCard from '@/components/ProductCard';
import { Category, Product } from '@/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  
  useEffect(() => {
    // Get URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
    
    // Fetch data
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on category and search query
  const filteredProducts = products
    .filter((product) => {
      // Filter by category if provided
      if (category && category !== 'all') {
        return product.categories.some((cat) => cat._ref === category);
      }
      return true;
    })
    .filter((product) => {
      // Filter by search query if provided
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Filters Section */}
        <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={20} />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-col gap-2">
              <a
                href="/products"
                className={`px-3 py-2 rounded-md ${!category ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                All Categories
              </a>
              {categories.map((cat: Category) => (
                <a
                  key={cat._id}
                  href={`/products?category=${cat.slug.current}`}
                  className={`px-3 py-2 rounded-md ${category === cat.slug.current ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid and Search */}
        <div className="w-full md:w-3/4">
          {/* Search Bar */}
          <form className="mb-6">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={search || ''}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-1"
              >
                Search
              </button>
            </div>
          </form>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="large" text="Loading products..." />
            </div>
          ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try changing your search criteria or browse all products.
                </p>
                <a
                  href="/products"
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View All Products
                </a>
              </div>
            )}
          
        </div>
      </div>
    </div>
  );
}