import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Product } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('=== PRODUCT CREATE API CALLED ===');
    
    // Get token from cookies or Authorization header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user is a supplier
    if (user.role !== 'supplier') {
      return NextResponse.json(
        { error: 'Only suppliers can create products' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('Product creation request:', body);

    const {
      name,
      description,
      category,
      subcategory,
      price,
      minOrderQuantity,
      unit,
      images,
      specifications,
      tags,
      city,
      state
    } = body;

    // Validation
    if (!name || !description || !category || !price || !minOrderQuantity || !unit) {
      return NextResponse.json(
        { error: 'Required fields: name, description, category, price, minOrderQuantity, unit' },
        { status: 400 }
      );
    }

    if (price <= 0 || minOrderQuantity <= 0) {
      return NextResponse.json(
        { error: 'Price and minimum order quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database for product creation...');
    await connectToDatabase();

    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      subcategory: subcategory?.trim() || '',
      price: Number(price),
      minOrderQuantity: Number(minOrderQuantity),
      unit: unit.trim(),
      images: images || [],
      specifications: specifications || {},
      supplierId: user.id,
      supplierName: user.name,
      supplierBusinessName: user.businessName,
      location: {
        city: city || user.city || '',
        state: state || user.state || ''
      },
      city: city || user.city || '',
      state: state || user.state || '',
      isActive: true,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Saving new product to database...');
    const savedProduct = await newProduct.save();
    console.log('✅ Product created successfully:', savedProduct._id);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: savedProduct._id,
        name: savedProduct.name,
        description: savedProduct.description,
        category: savedProduct.category,
        subcategory: savedProduct.subcategory,
        price: savedProduct.price,
        minOrderQuantity: savedProduct.minOrderQuantity,
        unit: savedProduct.unit,
        images: savedProduct.images,
        specifications: savedProduct.specifications,
        supplierId: savedProduct.supplierId,
        supplierName: savedProduct.supplierName,
        supplierBusinessName: savedProduct.supplierBusinessName,
        location: savedProduct.location,
        isActive: savedProduct.isActive,
        tags: savedProduct.tags,
        createdAt: savedProduct.createdAt,
        updatedAt: savedProduct.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ PRODUCT CREATE ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
