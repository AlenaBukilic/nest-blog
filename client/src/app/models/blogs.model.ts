export interface Blog {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  publishedDate?: Date;
  isPublished?: boolean;
  likes?: number;
  headerImg?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogsPaginated {
  data: Blog[];
  metadata: {
    total: number;
    perPage: number | undefined;
    page: number | undefined;
    lastPage: number;
  };
}