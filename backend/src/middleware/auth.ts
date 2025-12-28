// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  user_id: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get token from Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    // Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Get user from token and exclude password
    const user = await User.findById(payload.user_id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;