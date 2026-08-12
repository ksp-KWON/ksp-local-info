export type PostData = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string | string[];
  tags?: string[];
  sourceLink?: string;
  content: string;
};
