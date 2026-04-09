export type Post = {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    videoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type CreatePostInput = {
    title: string;
    description: string;
    imageUrl?: string;
    videoUrl?: string;
  };
  
  export type UpdatePostInput = {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
  };