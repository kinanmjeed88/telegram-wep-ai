export interface Channel {
  name: string;
  url: string;
}

export interface ChannelCategory {
  title:string;
  channels: Channel[];
}

export interface NewsSource {
  title: string;
  uri: string;
}

export interface AiNewsPost {
  title: string;
  summary: string;
  sources: NewsSource[];
}

// --- New Admin & Dynamic Content Types ---

export interface SiteSettings {
  siteName: string;
  announcementText: string;
  announcementLink: string;
  primaryColor: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    mainTelegram: string;
  };
}

export interface Profile {
  name: string;
  bio: string;
  contactLink: string;
}

export interface PostCategory {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
}

export interface SiteData {
  settings: SiteSettings;
  profile: Profile;
  channelCategories: ChannelCategory[];
  postCategories: PostCategory[];
  posts: Post[];
}
