import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const refreshTokensBlacklist: string[] = [];

export const signup = async (req: Request, res: Response) => {
  console.log('Signup controller hit');

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User created" });
};

export const login = async (req: Request, res: Response) => {
  console.log(' Login controller hit');

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh', // must match refresh route
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  console.log('♻️ Refresh token controller hit');

  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    if (refreshTokensBlacklist.includes(token)) {
      return res.status(403).json({ message: 'Token has been revoked' });
    }

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
    const accessToken = generateAccessToken(payload.userId);

    res.json({ accessToken });
  } catch (error: any) {
    console.error('Refresh error:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log(' Logout controller hit');

  const token = req.cookies.refreshToken;
  if (token) {
    refreshTokensBlacklist.push(token); // simple in-memory blacklist
  }

  res.clearCookie('refreshToken', {
    path: '/api/auth/refresh', //  must match cookie path
  });

  res.json({ message: "Logged out" });
};
