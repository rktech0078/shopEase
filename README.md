# E-Commerce Application

## Overview
A modern e-commerce application built with Next.js 14, Tailwind CSS, and Sanity CMS. This application includes product browsing, cart functionality, checkout process, and an admin dashboard for order management.

## Features

### Customer Features
- Browse products with category filtering and search
- View detailed product information
- Add products to cart
- Checkout process with shipping and payment information
- Order confirmation and tracking

### Admin Features
- Secure admin dashboard
- View and manage all orders
- Update order status and payment status
- View detailed order information

## Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend/CMS**: Sanity.io
- **State Management**: React Context API
- **Authentication**: Simple authentication for admin dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Sanity account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the admin credentials

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Dashboard

Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin) using the credentials specified in your `.env.local` file.

## Sanity Studio

To manage your content, access the Sanity Studio:

```bash
npm run sanity:dev
# or
yarn sanity:dev
```

Then open [http://localhost:3333](http://localhost:3333) in your browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
