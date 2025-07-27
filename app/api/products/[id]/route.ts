import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS, Product } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
      isActive: true
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (suppliers only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
        { error: 'Only suppliers can update products' },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
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
      tags,
      isActive
    } = body;

    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    
    // Check if product exists and belongs to the supplier
    const existingProduct = await productsCollection.findOne({
      _id: new ObjectId(id),
      supplierId: user.id
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category.trim();
    if (subcategory !== undefined) updateData.subcategory = subcategory.trim();
    if (price) updateData.price = parseFloat(price);
    if (minOrderQuantity) updateData.minOrderQuantity = parseInt(minOrderQuantity);
    if (unit) updateData.unit = unit.trim();
    if (images) updateData.images = images;
    if (specifications) updateData.specifications = specifications;
    if (location) updateData.location = location;
    if (tags) updateData.tags = tags;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (suppliers only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
        { error: 'Only suppliers can delete products' },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const productsCollection = await getCollection(COLLECTIONS.PRODUCTS);
    
    // Soft delete - set isActive to false
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id), supplierId: user.id },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
