import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS, Product } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const supplierId = searchParams.get('supplierId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    
    // Build filter query
    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (supplierId) filter.supplierId = supplierId;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { supplierBusinessName: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [products, totalCount] = await Promise.all([
      productsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      productsCollection.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (suppliers only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'supplier') {
      return NextResponse.json(
        { error: 'Only suppliers can create products' },
        { status: 403 }
      );
    }

    const body = await request.json();
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
      location,
      tags
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
        { error: 'Price and minimum order quantity must be positive numbers' },
        { status: 400 }
      );
    }

    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    
    const newProduct: Product = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      subcategory: subcategory?.trim() || '',
      price: parseFloat(price),
      minOrderQuantity: parseInt(minOrderQuantity),
      unit: unit.trim(),
      images: images || [],
      specifications: specifications || {},
      supplierId: user.id,
      supplierName: user.name,
      supplierBusinessName: user.businessName,
      location: location || { city: '', state: '' },
      isActive: true,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertedId.toString(),
      product: { ...newProduct, _id: result.insertedId.toString() }
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
