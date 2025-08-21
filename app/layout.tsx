import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "@/context/CartContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShopEase - Your One-Stop Online Shopping Destination",
  description: "Discover quality products at affordable prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.",
  keywords: "online shopping, ecommerce, electronics, fashion, home goods, affordable products",
  authors: [{ name: "ShopEase Team" }],
  creator: "ShopEase",
  publisher: "ShopEase Inc.",
  openGraph: {
    title: "ShopEase - Your One-Stop Online Shopping Destination",
    description: "Discover quality products at affordable prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.",
    url: "https://shopease.com",
    siteName: "ShopEase",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShopEase - Online Shopping",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopEase - Your One-Stop Online Shopping Destination",
    description: "Discover quality products at affordable prices. Shop electronics, fashion, home goods and more.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
