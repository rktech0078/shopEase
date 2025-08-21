'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            ShopEase
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", href: "/" },
              { name: "Categories", href: "/categories" },
              { name: "Products", href: "/products" },
              { name: "About Us", href: "/about" },
              { name: "Contact", href: "/contact" },
              { name: "Admin", href: "/admin" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="relative text-gray-700 dark:text-gray-200 group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <Link
              href="/cart"
              className="relative text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 translate-x-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-red-500"
                >
                  <X size={26} />
                </button>
              </div>
              <nav className="flex flex-col p-4 space-y-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "Categories", href: "/categories" },
                  { name: "Products", href: "/products" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact", href: "/contact" },
                  { name: "Admin", href: "/admin" },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default Navbar;
