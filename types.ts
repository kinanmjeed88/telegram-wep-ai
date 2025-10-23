export interface Channel {
  name: string;
  url: string;
}

export interface Category {
  title: string;
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
