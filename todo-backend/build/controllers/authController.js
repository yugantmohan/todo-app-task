"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
const jwt_js_1 = require("../utils/jwt.js");
const refreshTokensBlacklist = [];
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Signup controller hit');
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const existingUser = yield User_js_1.default.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = new User_js_1.default({ email, password: hashedPassword });
    yield newUser.save();
    res.status(201).json({ message: "User created" });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' Login controller hit');
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = yield User_js_1.default.findOne({ email });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = (0, jwt_js_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, jwt_js_1.generateRefreshToken)(user._id.toString());
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh', // must match refresh route
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('♻️ Refresh token controller hit');
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        if (refreshTokensBlacklist.includes(token)) {
            return res.status(403).json({ message: 'Token has been revoked' });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = (0, jwt_js_1.generateAccessToken)(payload.userId);
        res.json({ accessToken });
    }
    catch (error) {
        console.error('Refresh error:', error.message);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' Logout controller hit');
    const token = req.cookies.refreshToken;
    if (token) {
        refreshTokensBlacklist.push(token); // simple in-memory blacklist
    }
    res.clearCookie('refreshToken', {
        path: '/api/auth/refresh', //  must match cookie path
    });
    res.json({ message: "Logged out" });
});
exports.logout = logout;
