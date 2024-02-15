import { UserRole } from './user.schema';

export const supportedRoles = Object.values(UserRole);
export interface UserPublic {
  name?: string;
  username?: string;
  email?: string;
  emailToLowerCase?: string;
  id?: string;
  role?: UserRole;
  profileImg?: string;
}
