export type UserRole = 'user' | 'admin' | 'host';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number;
  capacity: number;
  hostId: string;
  category: string;
  registeredUsers: string[];
}