import type { Role, User, Prisma } from '@prisma/client';
import prisma from '../../src/lib/db/prisma.js';
import { hashPassword } from '../../src/lib/auth/password.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  ListUsersQuery,
} from './schemas.js';

// Type for user without password
export type SafeUser = Omit<User, 'password'>;

/**
 * List users with pagination and filters
 */
export async function listUsers(query: ListUsersQuery) {
  const { page, perPage, search, role, isActive, sortBy, sortOrder } = query;

  const skip = (page - 1) * perPage;

  // Build where clause
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  // Execute queries in parallel
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: perPage,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    users,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
    },
  };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserInput): Promise<SafeUser> {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || 'USER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  role: Role
): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(
  id: string,
  isActive: boolean
): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Delete user (soft delete by deactivating)
 */
export async function deleteUser(id: string): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Check if email is already in use
 */
export async function isEmailTaken(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return false;
  if (excludeId && user.id === excludeId) return false;

  return true;
}
