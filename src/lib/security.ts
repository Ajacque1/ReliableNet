import { z } from 'zod'

// Password validation
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true };
}

// File validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILES = 5;

export function validateFile(file: File): { isValid: boolean; message?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, message: 'File size must be less than 5MB' };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, message: 'Invalid file type. Allowed types: JPEG, PNG, GIF' };
  }
  return { isValid: true };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}

// Rate limiting configuration
export const RATE_LIMITS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 requests per window
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // 10 uploads per hour
  }
};

// CORS configuration
export const CORS_OPTIONS = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Security headers
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
};

// Validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters')
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  pros: z.array(z.string().max(200)),
  cons: z.array(z.string().max(200))
});

export const speedTestSchema = z.object({
  downloadSpeed: z.number().min(0),
  uploadSpeed: z.number().min(0),
  ping: z.number().min(0),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional()
  })
}); 