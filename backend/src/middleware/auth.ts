import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}