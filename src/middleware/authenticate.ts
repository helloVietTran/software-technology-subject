import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ErrTokenInvalid } from '../core/error';

dotenv.config();

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      return next(ErrTokenInvalid.withMessage('Token is missing'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ErrTokenInvalid.withMessage('Token is missing'));
    }


    const decodedPayload = null;
    if (!decodedPayload) {
      return next(ErrTokenInvalid.withMessage('Token parse failed'));
    }

    const requester = decodedPayload as any;
    res.locals['requester'] = requester;

    next();
  } catch (err) {
    next(err); 
  }
};

export default authenticate;
