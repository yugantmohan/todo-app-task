import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

console.log('🌟 DEBUG ENV VARIABLES:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINED' : 'MISSING');
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'DEFINED' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'DEFINED' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Test JWT creation
const testSecret = 'temporary-debug-secret';
const testToken = jwt.sign({ test: 'data' }, testSecret);
console.log('✅ Test token generated:', testToken ? 'SUCCESS' : 'FAILED');

// Test JWT verification
try {
  const decoded = jwt.verify(testToken, testSecret);
  console.log('✅ Test token verified:', decoded);
} catch (err) {
  console.error('❌ Test token verification FAILED:', err);
}
