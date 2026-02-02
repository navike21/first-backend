import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (expires in 15 minutes)
 */
export function generateAccessToken(payload: JWTPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: '15m',
    });
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Could not generate access token');
  }
}

/**
 * Generate refresh token (expires in 7 days)
 */
export function generateRefreshToken(payload: JWTPayload): string {
  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Could not generate refresh token');
  }
}

/**
 * Generate both tokens
 */
export function generateTokens(payload: JWTPayload): TokenResponse {
  try {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new Error('Could not generate tokens');
  }
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET as string) as unknown as JWTPayload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET as string) as JWTPayload;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    throw new Error('Invalid or expired refresh token');
  }
}
