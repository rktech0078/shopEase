import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-12 pb-8 overflow-hidden">
      {/* subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,black,transparent_30%)]"></div>

      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              ShopEase
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
              Your one-stop destination for quality products at affordable
              prices.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: <Facebook size={20} />,
                  href: "https://facebook.com",
                  hover: "hover:bg-blue-500",
                },
                {
                  icon: <Twitter size={20} />,
                  href: "https://twitter.com",
                  hover: "hover:bg-sky-400",
                },
                {
                  icon: <Instagram size={20} />,
                  href: "https://instagram.com",
                  hover: "hover:bg-pink-500",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 ${item.hover} hover:text-white`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="group relative inline-block text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                  >
                    {item.label}
                    <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="group relative inline-block text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                  >
                    {item.label}
                    <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>123 Shopping Street, Retail City, RC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} />
                <a
                  href="tel:+1234567890"
                  className="hover:text-blue-500 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} />
                <a
                  href="mailto:info@shopease.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  info@shopease.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-10 pt-6 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
          <p>
            &copy; {currentYear} ShopEase. All rights reserved. | Made with{" "}
            <span className="text-red-500 animate-pulse">❤</span> for customers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
