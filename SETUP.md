# Vendor Connect - Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DB_NAME=vendor_connect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

## MongoDB Setup

1. **Install MongoDB locally** or use **MongoDB Atlas** (cloud)
   - Local: Download from https://www.mongodb.com/try/download/community
   - Atlas: Create free account at https://www.mongodb.com/atlas

2. **For local MongoDB:**
   - Start MongoDB service
   - Default connection: `mongodb://localhost:27017`

3. **For MongoDB Atlas:**
   - Create cluster
   - Get connection string
   - Update `MONGODB_URI` in `.env.local`

## Authentication Features Fixed

✅ **User Registration:**
- Unique email and phone number validation
- Password hashing with bcrypt
- Proper MongoDB storage with error handling
- Duplicate user prevention

✅ **User Login:**
- Email and password authentication
- JWT token generation
- Role-based access (vendor/supplier)
- Enhanced error handling

✅ **Database:**
- Unique indexes for email and phone
- Connection pooling and retry logic
- ObjectId type compatibility
- Proper error handling

## Testing Authentication

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration:**
   - Navigate to signup page
   - Fill in all required fields
   - Verify account creation

3. **Test user login:**
   - Use registered email and password
   - Verify JWT token generation
   - Check role-based access

## Common Issues

- **MongoDB Connection Error:** Ensure MongoDB is running and connection string is correct
- **Duplicate User Error:** System now properly prevents duplicate emails/phones
- **JWT Token Issues:** Ensure JWT_SECRET is set in environment variables
