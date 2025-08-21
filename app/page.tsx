import { Metadata } from 'next';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
// import Newsletter from '../components/Newsletter';  
import { HeroSectionSkeleton } from '@/components/ui/skeleton';
import CategorySectionLoading from '@/components/CategorySectionLoading';
import FeaturedProductsLoading from '@/components/FeaturedProductsLoading';
import { getActiveBanners, getCategories, getFeaturedProducts } from '@/sanity/lib/api';

export const metadata: Metadata = {
  title: 'ShopEase - Your One-Stop E-commerce Shop',
  description: 'Shop the latest products at affordable prices with ShopEase',
};

export const revalidate = 3600; // Revalidate at most every hour

export default async function Home() {
  // Fetch data in parallel with error handling
  const [banners, categories, featuredProducts] = await Promise.all([
    getActiveBanners().catch(error => {
      console.error('Error fetching banners:', error);
      return [];
    }),
    getCategories().catch(error => {
      console.error('Error fetching categories:', error);
      return [];
    }),
    getFeaturedProducts().catch(error => {
      console.error('Error fetching featured products:', error);
      return [];
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection banners={banners} />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />

      {/* Newsletter Section */}
      <section className="relative bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-12 pb-8 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Stay updated with our latest products, exclusive offers, and discounts.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section
      <footer className="mt-auto row-start-3 flex gap-6 flex-wrap items-center justify-center py-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
