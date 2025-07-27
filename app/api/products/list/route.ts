import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Product } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('=== PRODUCTS LIST API CALLED ===');
    
    // Connect to database
    console.log('Connecting to database for products list...');
    await connectToDatabase();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    let query: any = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    console.log('Fetching products with query:', query);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    
    // Fetch products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    console.log(`✅ Found ${products.length} products out of ${totalProducts} total`);

    // Format products for response
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      minOrderQuantity: product.minOrderQuantity,
      unit: product.unit,
      images: product.images || [],
      specifications: product.specifications || {},
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      supplierBusinessName: product.supplierBusinessName,
      location: product.location || { city: (product as any).city || '', state: (product as any).state || '' },
      city: (product as any).city,
      state: (product as any).state,
      isActive: product.isActive,
      tags: product.tags || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ PRODUCTS LIST ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
