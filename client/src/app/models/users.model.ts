export interface User {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  username?: string;
  profileImg?: string;
  role?: string;
  id?: string;
}

export interface UsersPaginated {
  data: User[];
  metadata: {
    total: number;
    perPage: number | undefined;
    page: number | undefined;
    lastPage: number;
  };
}
