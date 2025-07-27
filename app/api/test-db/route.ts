import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, User } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DATABASE TEST API CALLED ===');
    
    // Test database connection
    console.log('Testing database connection...');
    await connectToDatabase();
    console.log('✅ Database connection successful');
    
    // Test user count
    const userCount = await User.countDocuments();
    console.log('📊 Total users in database:', userCount);
    
    // Test user retrieval
    const users = await User.find({}, { password: 0 }).limit(5);
    console.log('👥 Sample users:', users.map(u => ({ id: u._id, email: u.email, name: u.name })));
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      data: {
        connected: true,
        userCount,
        sampleUsers: users.map(u => ({
          id: u._id?.toString(),
          email: u.email,
          name: u.name,
          role: u.role,
          businessName: u.businessName
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ DATABASE TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
