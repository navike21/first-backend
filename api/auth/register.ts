import type { Request, Response } from 'express';
import { registerSchema } from '../../src/lib/auth/schemas.js';
import prisma from '../../src/lib/db/prisma.js';
import { hashPassword } from '../../src/lib/auth/password.js';
import { generateTokens } from '../../src/lib/auth/jwt.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const { error, badRequest, created, validationError, internalError } =
    ApiResponder;

  if (req.method !== 'POST') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    // 1️⃣ Validar input
    const { email, name, password } = registerSchema.parse(req.body);

    // 2️⃣ Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return badRequest(res, {
        message: 'Email already registered',
      });
    }

    // 3️⃣ Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // 4️⃣ Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // 5️⃣ Generar tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 6️⃣ Responder
    return created(res, {
      data: { user, tokens },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Validation error',
      });
    }

    return internalError(res, { error });
  }
}
