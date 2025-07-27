// Database configuration and connection utilities using Mongoose
import mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adhavrohit37:testing123@cluster0.5kaa2ks.mongodb.net/vendor_connect?retryWrites=true&w=majority&appName=Cluster0';

// Connection state
let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection in progress...');
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('Connection string:', MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas');
    console.log('Database name:', mongoose.connection.db?.databaseName);
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Database connection failed: ${errorMessage}`);
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  isConnected = false;
});

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
} as const;

// Mongoose Schemas and Models

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['vendor', 'supplier'] },
  businessName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  businessType: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  minOrderQuantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true, trim: true },
  images: [{ type: String }],
  specifications: { type: Schema.Types.Mixed, default: {} },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true, trim: true },
  supplierBusinessName: { type: String, required: true, trim: true },
  location: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true }
  },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  vendorId: { type: String, required: true },
  supplierId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date },
  deliveryAddress: {
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true }
  },
  notes: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  subcategories: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// TypeScript interfaces for type safety
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'vendor' | 'supplier';
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessType: string;
  description: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  minOrderQuantity: number;
  unit: string;
  images: string[];
  specifications: Record<string, any>;
  supplierId: string;
  supplierName: string;
  supplierBusinessName: string;
  location: {
    city: string;
    state: string;
  };
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  orderId: string;
  vendorId: string;
  supplierId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

// Legacy interface for backward compatibility
export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'vendor' | 'supplier';
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessType: string;
  description: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
