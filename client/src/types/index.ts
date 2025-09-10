export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  rank: Rank;
  profilePicture: string;
  bio: string;
  joinDate: string;
  lastSeen: string;
}

export interface Rank {
  id: string;
  name: string;
  displayName: string;
  level: number;
  icon: string;
  description: string;
  requirements: string;
  privileges: string[];
}

export interface Message {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePicture: string;
  };
  rank: Rank;
  rankName: string;
  rankIcon: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments: Attachment[];
  isEdited: boolean;
  editedAt?: string;
  reactions: Reaction[];
  replyTo?: Message;
  createdAt: string;
  formattedTime: string;
  formattedDate: string;
}

export interface Attachment {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Reaction {
  user: string;
  emoji: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingUsers: string[];
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RankState {
  ranks: Rank[];
  isLoading: boolean;
  error: string | null;
}

export interface OnlineUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  rank: Rank;
  profilePicture: string;
  lastSeen: string;
}

export interface SocketMessage {
  id: number;
  username: string;
  rank: Rank;
  rankIcon: string;
  message: string;
  timestamp: Date;
}

export interface TypingUser {
  username: string;
  isTyping: boolean;
}