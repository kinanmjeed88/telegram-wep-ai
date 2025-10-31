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

export interface SiteData {
  profile: {
    name: string;
    bio: string;
    picture: string;
  };
  settings: {
    siteName: string;
    announcement: string;
    socialLinks: Array<{
      icon: string;
      url: string;
    }>;
  };
}

export interface ChannelCategory {
  name: string;
  description: string;
  channels: string[];
}