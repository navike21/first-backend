import supabase from '../../src/lib/supabase.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  ListUsersQuery,
  Role,
} from './schemas.js';

// Type for user data returned from Supabase
interface UserRow {
  id: string;
  email: string;
  name: string;
  lastName: string;
  birth: string | null;
  address: string | null;
  sex: string | null;
  photoUrl: string | null;
  documentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserAuthRow {
  role: Role;
  isActive: boolean;
}

// Type for user without sensitive auth data
export type SafeUser = Omit<UserRow, 'password'> & {
  auth?: UserAuthRow | null;
};

/**
 * List users with pagination and filters
 */
export async function listUsers(query: ListUsersQuery) {
  const { page, perPage, search, role, isActive, sortBy, sortOrder } = query;

  const offset = (page - 1) * perPage;
  const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  let userQuery = supabase
    .from('user')
    .select('*, auth:user_auth(role, isActive)');

  // Apply search filter
  if (search) {
    userQuery = userQuery.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,lastName.ilike.%${search}%`
    );
  }

  // Apply role filter if provided
  if (role) {
    userQuery = userQuery.eq('auth.role', role);
  }

  // Apply isActive filter if provided
  if (isActive !== undefined) {
    userQuery = userQuery.eq('auth.isActive', isActive);
  }

  // Execute count query
  const { count } = await supabase
    .from('user')
    .select('id', { count: 'exact', head: true });

  // Execute user query with pagination and sorting
  const { data: users, error } = await userQuery
    .order(sortBy, { ascending: sortDirection === 'asc' })
    .range(offset, offset + perPage - 1);

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    users: (users || []) as unknown as Array<SafeUser>,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
    },
  };
}

/**
 * Get user by ID (with auth data if exists)
 */
export async function getUserById(id: string) {
  const { data: user, error } = await supabase
    .from('user')
    .select('*, auth:user_auth(role, isActive)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get user: ${error.message}`);
  }

  return user as unknown as SafeUser | null;
}

/**
 * Create new user (personal data only, no authentication)
 */
export async function createUser(data: CreateUserInput) {
  const { data: user, error } = await supabase
    .from('user')
    .insert([
      {
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        birth: data.birth,
        address: data.address,
        sex: data.sex,
        photoUrl: data.photoUrl,
        documentId: data.documentId,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return user as unknown as Omit<SafeUser, 'auth'>;
}

/**
 * Update user (personal data only)
 */
export async function updateUser(id: string, data: UpdateUserInput) {
  const { data: user, error } = await supabase
    .from('user')
    .update({
      ...(data.email && { email: data.email }),
      ...(data.name && { name: data.name }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.birth && { birth: data.birth }),
      ...(data.address && { address: data.address }),
      ...(data.sex && { sex: data.sex }),
      ...(data.photoUrl && { photoUrl: data.photoUrl }),
      ...(data.documentId && { documentId: data.documentId }),
    })
    .eq('id', id)
    .select('*, auth:user_auth(role, isActive)')
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return user as unknown as SafeUser;
}

/**
 * Update user role (in auth table)
 */
export async function updateUserRole(id: string, role: Role) {
  // Get user's auth ID from Supabase Auth
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('email')
    .eq('id', id)
    .single();

  if (userError || !userData) {
    throw new Error(`Failed to find user: ${userError?.message}`);
  }

  // Get the auth user to find their auth ID
  const { data: authUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const authUser = authUsers.users.find((u) => u.email === userData.email);

  if (!authUser) {
    throw new Error('User authentication not found');
  }

  // Update role in user_metadata using admin API
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    authUser.id,
    {
      user_metadata: {
        ...authUser.user_metadata,
        role,
      },
    }
  );

  if (updateError) {
    throw new Error(`Failed to update role: ${updateError.message}`);
  }

  // Return the updated user with new role
  const { data: user, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch updated user: ${error.message}`);
  }

  return {
    ...user,
    auth: {
      role,
      isActive: true,
    },
  } as unknown as SafeUser;
}

/**
 * Toggle user active status (in auth table)
 */
export async function toggleUserStatus(id: string, isActive: boolean) {
  // First get the userAuth ID for this user
  const { data: authData, error: authError } = await supabase
    .from('user_auth')
    .select('id')
    .eq('userId', id)
    .single();

  if (authError) {
    throw new Error(`Failed to find user auth: ${authError.message}`);
  }

  // Update the isActive status in user_auth
  await supabase.from('user_auth').update({ isActive }).eq('id', authData.id);

  // Return the updated user
  const { data: user, error } = await supabase
    .from('user')
    .select('*, auth:user_auth(role, isActive)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch updated user: ${error.message}`);
  }

  return user as unknown as SafeUser;
}

/**
 * Delete user (deactivate auth, not the user itself)
 */
export async function deleteUser(id: string) {
  // First get the userAuth ID for this user
  const { data: authData, error: authError } = await supabase
    .from('user_auth')
    .select('id')
    .eq('userId', id)
    .single();

  if (authError) {
    throw new Error(`Failed to find user auth: ${authError.message}`);
  }

  // Deactivate the auth by setting isActive to false
  await supabase
    .from('user_auth')
    .update({ isActive: false })
    .eq('id', authData.id);

  // Return the updated user
  const { data: user, error } = await supabase
    .from('user')
    .select('*, auth:user_auth(role, isActive)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch updated user: ${error.message}`);
  }

  return user as unknown as SafeUser;
}

/**
 * Check if email is already in use
 */
export async function isEmailTaken(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const { data: user, error } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false; // Not found
    }
    throw new Error(`Failed to check email: ${error.message}`);
  }

  if (!user) return false;
  if (excludeId && user.id === excludeId) return false;

  return true;
}
