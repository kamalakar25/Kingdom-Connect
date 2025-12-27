import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET is not defined in production environment');
}

const SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export const signAccessToken = (payload: object) => {
    return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES });
};

export const signRefreshToken = (payload: object) => {
    return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRES });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (_e) {
        return null;
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
