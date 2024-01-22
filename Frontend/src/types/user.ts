import { EmojiStyle } from "emoji-picker-react";


export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | URL | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  categories: Category[];
  settings: AppSettings[];
}

export interface Task {
  id: number;
  done: boolean;
  name: string;
  description?: string;
  color: string;
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
  sharedBy?: string;
}


export interface Category {
  id: number;
  name: string;
  emoji?: string;
  color: string;
}

export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
  voice: string;
  voiceVolume: number;
}

export interface UserProps {
  user: User; 
  setUser: React.Dispatch<React.SetStateAction<User>>; 
}
