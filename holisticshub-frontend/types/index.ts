export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  created_at: string;
}

export interface Protocol {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  status: string;
  views: number;
  avg_rating: number;
  vote_count: number;
  reviews_count?: number;
  threads_count?: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: number;
  user_id: number;
  protocol_id?: number;
  title: string;
  body: string;
  tags: string[];
  is_pinned: boolean;
  views: number;
  vote_count: number;
  upvote_count: number;
  downvote_count: number;
  comments_count?: number;
  user?: User;
  protocol?: Protocol;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number
  user_id: number
  commentable_id: number
  commentable_type: string
  parent_id: number | null
  body: string
  created_at: string
  updated_at: string
  user?: User
  replies?: Comment[]
  upvote_count?: number
  downvote_count?: number
  user_vote?: 'up' | 'down' | null
}

export interface Review {
  id: number;
  user_id: number;
  protocol_id: number;
  rating: number;
  body?: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: number;
  user_id: number;
  votable_id: number;
  votable_type: string;
  type: "up" | "down";
  created_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}