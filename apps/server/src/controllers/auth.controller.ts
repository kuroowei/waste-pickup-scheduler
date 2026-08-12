import { Request, Response } from 'express';
import { registerUser, loginUser, getCurrentUser, requestPasswordReset, resetPassword, AuthError } from '../services/auth.service';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { verifyRefreshToken, signAccessToken, TokenPayload } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const REFRESH_COOKIE_NAME = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number',
      });
    }

    const { user, accessToken, refreshToken } = await registerUser({ fullName, email, password, phone, address });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
    return res.status(201).json({ user, accessToken });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
  return res.status(200).json({ message: 'Logged out successfully' });
}

export function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const payload = verifyRefreshToken(token) as TokenPayload;
    const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role });
    return res.status(200).json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getCurrentUser(req.user!.userId);
    return res.status(200).json({ user });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await requestPasswordReset(email);

    // Always return the same success message, regardless of whether the email exists.
    return res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number',
      });
    }

    await resetPassword(token, newPassword);
    return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}