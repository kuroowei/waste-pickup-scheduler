import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { signAccessToken, signRefreshToken, TokenPayload } from '../utils/jwt';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

function sanitizeUser(user: Record<string, unknown>) {
  const { password, resetToken, resetTokenExpiresAt, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AuthError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      address: input.address,
    },
  });

  const payload: TokenPayload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AuthError('Invalid email or password', 401);
  }

  const payload: TokenPayload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user: sanitizeUser(user), accessToken, refreshToken };
}
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthError('User not found', 404);
  }
  return sanitizeUser(user);
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Deliberately don't reveal whether the email exists — always succeed silently.
  // This prevents attackers from using this endpoint to discover registered emails.
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiresAt },
  });

  // TODO: send this via email once Nodemailer is wired up.
  // For now, printed to the server console so it can be tested end-to-end.
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  console.log('\n========================================');
  console.log('PASSWORD RESET REQUESTED');
  console.log(`User: ${user.email}`);
  console.log(`Reset link: ${resetLink}`);
  console.log(`Expires: ${resetTokenExpiresAt.toISOString()}`);
  console.log('========================================\n');
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AuthError('This reset link is invalid or has expired', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });
}