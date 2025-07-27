import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS, Order } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET /api/orders - Get orders for authenticated user
export async function GET(request: NextRequest) {
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
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const ordersCollection = await getCollection(COLLECTIONS.ORDERS);
    
    // Build filter based on user role
    const filter: any = {};
    if (user.role === 'vendor') {
      filter.vendorId = user.id;
    } else if (user.role === 'supplier') {
      filter.supplierId = user.id;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [orders, totalCount] = await Promise.all([
      ordersCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      ordersCollection.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order (vendors only)
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
    if (!user || user.role !== 'vendor') {
      return NextResponse.json(
        { error: 'Only vendors can create orders' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      productId,
      quantity,
      deliveryAddress,
      notes
    } = body;

    // Validation
    if (!productId || !quantity || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Product ID, quantity, and delivery address are required' },
        { status: 400 }
      );
    }

    // Validate deliveryAddress structure
    if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      return NextResponse.json(
        { error: 'Delivery address must include address, city, state, and pincode' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Get product details
    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
      isActive: true
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or not available' },
        { status: 404 }
      );
    }

    // Check minimum order quantity
    if (quantity < product.minOrderQuantity) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${product.minOrderQuantity} ${product.unit}` },
        { status: 400 }
      );
    }

    const ordersCollection = await getCollection(COLLECTIONS.ORDERS);
    
    // Generate order ID
    const orderCount = await ordersCollection.countDocuments();
    const orderId = `ORD${Date.now()}${(orderCount + 1).toString().padStart(4, '0')}`;

    const totalAmount = quantity * product.price;
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7); // 7 days from now

    const newOrder: Order = {
      orderId,
      vendorId: user.id,
      supplierId: product.supplierId,
      productId: productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalAmount,
      status: 'pending',
      orderDate: new Date(),
      expectedDeliveryDate,
      deliveryAddress,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: result.insertedId.toString(),
      order: { ...newOrder, _id: result.insertedId.toString() }
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
