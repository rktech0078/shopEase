'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Search, User, Heart, ChevronDown, LogOut, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items with dropdowns
  const navigationItems = [
    { name: "Home", href: "/" },
    { 
      name: "Categories", 
      href: "/categories",
      dropdown: [
        { name: "Electronics", href: "/categories/electronics" },
        { name: "Fashion", href: "/categories/fashion" },
        { name: "Home & Garden", href: "/categories/home" },
        { name: "Sports", href: "/categories/sports" }
      ]
    },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-200/20 dark:border-gray-700/20"
            : "bg-transparent"
        }`}
      >
        {/* Top Bar - Optional promotional banner */}
        {!isScrolled && (
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-center py-2 text-sm font-medium">
            🎉 Free shipping on orders over Rs. 500! Limited time offer
          </div>
        )}

        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link href="/" className="group flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  ShopEase
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                  onMouseEnter={() => item.dropdown && setDropdownOpen(index)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 group"
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-300 ${
                          dropdownOpen === index ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && dropdownOpen === index && (
                    <div className="absolute top-full left-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 transform opacity-100 scale-100 transition-all duration-300">
                      {item.dropdown.map((dropItem, dropIndex) => (
                        <Link
                          key={dropIndex}
                          href={dropItem.href}
                          className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
                >
                  <Search size={20} />
                </button>
                
                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 mt-2">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
              >
                <Heart size={20} />
              </Link>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 mt-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-out lg:hidden">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Menu</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col p-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between w-full p-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown size={16} />}
                  </Link>
                  
                  {/* Mobile Dropdown Items */}
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.dropdown.map((dropItem, dropIndex) => (
                        <Link
                          key={dropIndex}
                          href={dropItem.href}
                          className="block p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={20} />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span className="font-medium">Sign In</span>
                  </Link>
                )}
                
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 p-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Search Overlay for Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSearchOpen(false)}>
          <div className="flex items-start justify-center pt-20">
            <div className="w-11/12 max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content overlap */}
      <div className={`${isScrolled ? 'h-16 lg:h-20' : 'h-24 lg:h-28'} transition-all duration-500`} />
    </>
  );
};

export default Navbar;