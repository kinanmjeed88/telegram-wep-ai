export interface App {
  name: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
  youtube_url?: string;
  content: string;
}

export interface PostListItem {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
}
