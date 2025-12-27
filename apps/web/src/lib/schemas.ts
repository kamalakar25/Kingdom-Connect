import * as z from 'zod';

export const passwordSchema = (t: (key: string) => string) => z.string()
    .min(8, t('auth.errors.minChars'))
    .regex(/[A-Z]/, t('auth.errors.uppercase'))
    .regex(/[a-z]/, t('auth.errors.lowercase'))
    .regex(/[0-9]/, t('auth.errors.number'))
    .regex(/[^A-Za-z0-9]/, t('auth.errors.special'));

export const emailSchema = (t: (key: string) => string) => z.string()
    .email(t('auth.errors.invalidEmail'));

export const nameSchema = (t: (key: string) => string) => z.string()
    .min(2, t('auth.errors.nameMin'));
