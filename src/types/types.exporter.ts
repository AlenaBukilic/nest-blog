import { UserPublic } from '../user/model/user.interface';

export type PaginationData = {
  data: UserPublic[];
  metadata: {
    total: number;
    perPage: number | undefined;
    page: number | undefined;
    lastPage: number;
  };
};

export type SearchQuery = {
  username: string;
};
