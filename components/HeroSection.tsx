'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/types';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { HeroSectionSkeleton } from './ui/skeleton';

interface HeroSectionProps {
  banners: Banner[];
}

const HeroSection = ({ banners }: HeroSectionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Loading skeleton delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerChange = useCallback(
    (getNextIndex: (prev: number) => number) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBanner(getNextIndex);
        setTimeout(() => setIsTransitioning(false), 200);
      }, 400);
    },
    []
  );

  const goToPrevious = useCallback(() => {
    handleBannerChange((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  }, [banners.length, handleBannerChange]);

  const goToNext = useCallback(() => {
    handleBannerChange((prev) => (prev + 1) % banners.length);
  }, [banners.length, handleBannerChange]);

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 animate-fade-in">
            Welcome to ShopEase
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Your one-stop destination for quality products at affordable prices.
          </p>
          <Button size="lg" className="animate-fade-in animation-delay-400">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];
  const imageUrl = banner.image ? urlFor(banner.image).url() : '';

  return (
    <div className="relative h-[420px] sm:h-[480px] md:h-[560px] lg:h-[640px] w-full overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={banner.title}
          fill
          priority
          className={`object-cover object-center transition-all duration-700 ease-in-out ${
            isTransitioning ? 'opacity-60 scale-105' : 'opacity-100 scale-100'
          }`}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            isTransitioning
              ? 'opacity-0 translate-y-6'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-3 sm:mb-6">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          {banner.buttonText && banner.buttonLink && (
            <Button
              size="lg"
              variant="primary"
              className="hover:scale-105 transition-transform shadow-lg"
            >
              <Link href={banner.buttonLink}>{banner.buttonText}</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-colors shadow-lg"
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-colors shadow-lg"
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner
                  ? 'bg-white scale-125 shadow-md'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
