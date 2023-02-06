import { UserRole } from './user.schema';

export interface UserPublic {
  name?: string;
  username?: string;
  email?: string;
  emailToLowerCase?: string;
  id?: string;
  role: UserRole;
}
