import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Product } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const product = await Product.findOne({
      _id: id,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
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

    await connectToDatabase();
    
    // Check if product exists and belongs to the supplier
    const existingProduct = await Product.findOne({
      _id: id,
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

    const result = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!result) {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Soft delete - set isActive to false
    const result = await Product.findOneAndUpdate(
      { _id: id, supplierId: user.id },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!result) {
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
