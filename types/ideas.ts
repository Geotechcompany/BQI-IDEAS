export interface Idea {
  id: number
  title: string
  description: string
  category: string
  department: string
  author_id: string
  created_at: string
  updated_at: string
  likes: number
  status: string
  _count: {
    likes_by: number
    comments: number
  }
}

export interface IdeaInput {
  title: string
  description: string
  category: string
  department: string
  author_id: string
} 