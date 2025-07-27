# VendorConnect - Vendor-Supplier Marketplace

A simple web application that connects vendors with suppliers for easy product ordering and management.

## What is VendorConnect?

VendorConnect is a marketplace platform where:
- **Suppliers** can add and manage their products
- **Vendors** can browse and order products from suppliers
- Both can manage their business through dedicated dashboards

## Features

### For Suppliers 🏪
- Create account and login
- Add new products with details (name, price, category, etc.)
- View all products in the marketplace
- Manage business profile

### For Vendors 🛒
- Create account and login
- Browse all available products
- Search and filter products by category
- View supplier information
- Order products from suppliers

### General Features ⚡
- User authentication (login/signup)
- Role-based dashboards
- Product search and filtering
- Responsive design
- Real-time data

## How to Use

### 1. Getting Started
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser
http://localhost:3000
```

### 2. Create Account
1. Go to `/signup`
2. Choose your role: **Supplier** or **Vendor**
3. Fill in your business details
4. Submit to create account

### 3. Login
1. Go to `/login`
2. Enter your email and password
3. Select your role (Supplier or Vendor)
4. Click login

### 4. For Suppliers
1. After login, you'll see the **Supplier Dashboard**
2. Click **"Add New Product"** to add products
3. Fill in product details:
   - Product name and description
   - Category (vegetables, fruits, grains, etc.)
   - Price and minimum order quantity
   - Location and tags
4. View all products in the marketplace

### 5. For Vendors
1. After login, you'll see the **Vendor Dashboard**
2. Browse **"Available Products"** section
3. Search products by name or filter by category
4. View supplier details and product information
5. Click **"Order Now"** to place orders

## Product Categories

- 🥬 Vegetables
- 🍎 Fruits  
- 🌾 Grains & Rice
- 🌶️ Spices
- 🛢️ Cooking Oil
- 🥛 Dairy Products
- 📦 Packaging

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **UI**: Tailwind CSS, Shadcn/ui

## Project Structure

```
vendor-connect/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── vendor/dashboard/  # Vendor dashboard
│   └── supplier/          # Supplier pages
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utilities and database
└── public/               # Static files
```

## Environment Setup

Create a `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Quick Demo

1. **Signup as Supplier** → Add some products
2. **Signup as Vendor** → Browse and order products
3. **Switch between roles** to see different dashboards

## Support

For any issues or questions, please check the code or contact the development team.

---

**Built with ❤️ for connecting vendors and suppliers**
