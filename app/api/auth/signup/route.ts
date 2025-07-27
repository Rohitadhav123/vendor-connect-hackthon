import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, User } from '@/lib/database';
import { hashPassword, generateToken, validateEmail, validatePassword, validatePhone, validatePincode, AuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      businessName,
      address,
      city,
      state,
      pincode,
      businessType,
      description,
      role,
      agreeToTerms
    } = body;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword || !businessName || 
        !address || !city || !state || !pincode || !businessType || !role) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be a 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    if (!validatePincode(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode. Must be a 6-digit number' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (role !== 'vendor' && role !== 'supplier') {
      return NextResponse.json(
        { error: 'Invalid role. Must be vendor or supplier' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Check for existing email
    const existingEmailUser = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingEmailUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Check for existing phone
    const existingPhoneUser = await User.findOne({ 
      phone: phone 
    });
    
    if (existingPhoneUser) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user with Mongoose
    let savedUser;
    try {
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role,
        businessName: businessName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        businessType: businessType.trim(),
        description: description?.trim() || '',
        isVerified: true, // Auto-verify for demo purposes
      });
      
      savedUser = await newUser.save();
      console.log('User created successfully with ID:', savedUser._id?.toString());
    } catch (insertError) {
      console.error('Error creating user:', insertError);
      
      // Handle duplicate key errors specifically
      if (insertError instanceof Error && insertError.message.includes('duplicate key')) {
        if (insertError.message.includes('email')) {
          return NextResponse.json(
            { error: 'An account with this email already exists' },
            { status: 409 }
          );
        }
        if (insertError.message.includes('phone')) {
          return NextResponse.json(
            { error: 'An account with this phone number already exists' },
            { status: 409 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const authUser: AuthUser = {
      id: savedUser._id?.toString() || '',
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      businessName: savedUser.businessName,
    };

    const token = generateToken(authUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
