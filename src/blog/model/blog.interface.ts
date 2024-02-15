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