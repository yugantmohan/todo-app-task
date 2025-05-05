"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Load environment variables
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../.env') });
console.log('🌟 DEBUG ENV VARIABLES:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINED' : 'MISSING');
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'DEFINED' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'DEFINED' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
// Test JWT creation
const testSecret = 'temporary-debug-secret';
const testToken = jsonwebtoken_1.default.sign({ test: 'data' }, testSecret);
console.log('✅ Test token generated:', testToken ? 'SUCCESS' : 'FAILED');
// Test JWT verification
try {
    const decoded = jsonwebtoken_1.default.verify(testToken, testSecret);
    console.log('✅ Test token verified:', decoded);
}
catch (err) {
    console.error('❌ Test token verification FAILED:', err);
}
