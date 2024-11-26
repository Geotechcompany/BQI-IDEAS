export interface Comment {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
}

export interface Like {
  user_id: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  department: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  likes: number;
  likes_by: Like[];
  comments: Comment[];
  _count: {
    likes_by: number;
    comments: number;
  }
}

export interface IdeaInput {
  title: string;
  description: string;
  category: string;
  department: string;
  author_id: string;
} 