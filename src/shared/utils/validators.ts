import { object, string, ref } from 'yup';
export const loginSchema = object().shape({
  email: string().email('Invalid email format').required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});
export const forgotPasswordSchema = object().shape({
  email: string().email('Invalid email format').required('Email is required'),
});
export const resetPasswordSchema = object().shape({
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain one uppercase letter')
    .matches(/[\d!@#$%^&*(),.?":{}|<>]/, 'Must contain one number or special char')
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});
