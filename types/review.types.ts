export interface User {
  _id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface EditHistory {
  comment: string;
  editedAt: string;
  _id: string;
}

export interface Reply {
  userId: User;
  comment: string;
  edited: boolean;
  _id: string;
  editHistory: EditHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: User;
  astrologerId: string;
  rating: number;
  comment: string;
  edited: boolean;
  helpful: User[];
  editHistory: EditHistory[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreReview {
  id: number;
  user: string;
  content: string;
  rating: number;
  date: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    perPage: number;
  };
}
