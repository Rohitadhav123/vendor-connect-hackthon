import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken, AuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { action, token, testUser } = await request.json();
    
    if (action === 'verify' && token) {
      console.log('🔍 DEBUG: Testing token verification');
      console.log('🔍 DEBUG: Token preview:', token.substring(0, 20) + '...');
      
      const result = verifyToken(token);
      
      return NextResponse.json({
        success: true,
        valid: !!result,
        user: result,
        message: result ? 'Token is valid' : 'Token is invalid'
      });
    }
    
    if (action === 'generate' && testUser) {
      console.log('🔍 DEBUG: Testing token generation');
      
      const token = generateToken(testUser);
      const verification = verifyToken(token);
      
      return NextResponse.json({
        success: true,
        token,
        verification,
        message: 'Token generated and verified'
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action or missing parameters'
    }, { status: 400 });
    
  } catch (error) {
    console.error('🔍 DEBUG: Error:', error);
    return NextResponse.json({
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
