export interface BlogPublic {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    userId?: string;
    publishedDate?: Date;
    isPublished?: boolean;
    likes?: number;
    headerImg?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Image {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}