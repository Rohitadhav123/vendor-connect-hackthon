import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, User } from '@/lib/database';
import { comparePassword, generateToken, validateEmail, AuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CALLED ===');
    const body = await request.json();
    console.log('Login request:', { email: body.email, role: body.role, password: '[HIDDEN]' });
    const { email, password, role } = body;

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (role !== 'vendor' && role !== 'supplier') {
      return NextResponse.json(
        { error: 'Invalid role. Must be vendor or supplier' },
        { status: 400 }
      );
    }

    // Connect to database and find user
    console.log('Connecting to database for login...');
    await connectToDatabase();
    console.log('Database connected, searching for user...');
    
    let user;
    try {
      console.log('Searching for user with email:', email.toLowerCase(), 'and role:', role);
      user = await User.findOne({ 
        email: email.toLowerCase(),
        role: role 
      });
      
      if (user) {
        console.log('✅ User found:', { id: user._id, email: user.email, name: user.name });
      } else {
        console.log('❌ No user found with provided credentials');
      }
    } catch (dbError) {
      console.error('❌ Database error during login:', dbError);
      return NextResponse.json(
        { error: 'Login service temporarily unavailable' },
        { status: 503 }
      );
    }

    if (!user) {
      // Generic error message to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password...');
    let isPasswordValid: boolean;
    try {
      isPasswordValid = await comparePassword(password, user.password);
      console.log('Password verification result:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    } catch (passwordError) {
      console.error('❌ Password verification error:', passwordError);
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      );
    }
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Account not verified. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const authUser: AuthUser = {
      id: user._id?.toString() || '',
      email: user.email,
      name: user.name,
      role: user.role,
      businessName: user.businessName,
    };

    const token = generateToken(authUser);

    // Update last login
    try {
      await User.findByIdAndUpdate(
        user._id,
        { updatedAt: new Date() }
      );
    } catch (updateError) {
      // Log error but don't fail login for this
      console.error('Failed to update last login time:', updateError);
    }

    console.log('✅ Login successful! Returning response...');
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        businessName: authUser.businessName,
      },
      token,
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
