export interface Channel {
  name: string;
  url: string;
  icon: string;
}

export interface Category {
  title: string;
  channels: Channel[];
}