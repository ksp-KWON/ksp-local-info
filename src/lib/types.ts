export type PostData = {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  summary: string;
  category?: string | string[];
  tags?: string[];
  sourceLink?: string;
  content: string;
  published?: boolean;
};

export type PostMeta = Omit<PostData, 'content'>;
