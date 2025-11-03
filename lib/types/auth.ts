export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'designer' | 'leader' | 'head_chapter' | 'admin';
  avatar_url?: string;
  bio?: string;
}
