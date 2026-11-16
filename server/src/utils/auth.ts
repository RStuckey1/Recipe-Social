import { jwtVerify, SignJWT } from 'jose';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const normalizeUserId = (value: unknown): string | undefined => {
  if (typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)) {
    return value;
  }
  if (!value || typeof value !== 'object' || !('buffer' in value)) {
    return undefined;
  }

  const buffer = (value as { buffer?: unknown }).buffer;
  if (!buffer || typeof buffer !== 'object') {
    return undefined;
  }

  const bytes = Object.keys(buffer)
    .sort((left, right) => Number(left) - Number(right))
    .map((key) => (buffer as Record<string, unknown>)[key]);
  if (bytes.length !== 12 || !bytes.every(
    (byte) => typeof byte === 'number' && Number.isInteger(byte) && byte >= 0 && byte <= 255
  )) {
    return undefined;
  }

  return (bytes as number[]).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const authenticateToken = async ({ req }: any) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is sent in the authorization header, extract the token from the header
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token is provided, return the request object as is
  if (!token) {
    return req;
  }

  // Try to verify the token
  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY || '');
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
      maxTokenAge: '2h',
    });
    const userData = payload.data as { username: string; email: string; _id: unknown };
    const userId = normalizeUserId(userData?._id);
    if (!userId) {
      throw new Error('Token contains an invalid user ID.');
    }
    req.user = { ...userData, _id: userId };
  } catch (err) {
    // If the token is invalid, log an error message
    console.log('Invalid token');
  }

  // Return the request object
  return req;
};

export const signToken = async (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id: String(_id) };
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY || '');

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return new SignJWT({ data: payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey);
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
