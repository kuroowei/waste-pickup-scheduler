import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { signAccessToken, signRefreshToken, TokenPayload } from '../utils/jwt';

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
  const { password, ...safeUser } = user;
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