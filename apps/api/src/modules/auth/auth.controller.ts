import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { ApiResponse } from '../../utils/api.utils';

export const register = async (req: Request, res: Response) => {
    const { email, password, name, locale } = req.body;
    const result = await AuthService.register(email, password, name, locale);
    return ApiResponse.success(res, result, 'User registered successfully', 201);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return ApiResponse.success(res, result, 'Login successful');
};

export const me = (req: Request, res: Response) => {
    // @ts-ignore
    return ApiResponse.success(res, req.user);
};

export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body;
    const result = await AuthService.loginWithGoogle(credential);
    return ApiResponse.success(res, result, 'Google login successful');
};
