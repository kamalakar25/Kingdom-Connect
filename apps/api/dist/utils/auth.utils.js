"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = exports.verifyToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';
const signAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRES });
};
exports.signRefreshToken = signRefreshToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch (e) {
        return null;
    }
};
exports.verifyToken = verifyToken;
// Mock Argon2 for now since we can't install native modules easily without build tools
// In production, use 'argon2' package
const hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        crypto_1.default.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':');
        crypto_1.default.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(key === derivedKey.toString('hex'));
        });
    });
};
exports.verifyPassword = verifyPassword;
