
export interface Channel {
  name: string;
  url: string;
}

export interface Category {
  title: string;
  channels: Channel[];
}
