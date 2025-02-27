import axios from 'axios';

const API_BASE_URL = '/api/v1/reviews';

export interface ReviewResponse {
  reviews: Review[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    perPage: number;
  };
}

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  astrologerId: string;
  rating: number;
  comment: string;
  edited: boolean;
  helpful: Array<{ _id: string; name: string }>;
  editHistory: Array<{
    comment: string;
    editedAt: string;
    _id: string;
  }>;
  replies: Array<{
    userId: {
      _id: string;
      name: string;
      avatar: string;
      role?: string;
    };
    comment: string;
    edited: boolean;
    _id: string;
    editHistory: Array<{
      comment: string;
      editedAt: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const reviewService = {
  // Get reviews for an astrologer
  getAstrologerReviews: async (
    astrologerId: string, 
    page: number = 1, 
    sort: string = 'latest'
  ): Promise<ReviewResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/astrologer/${astrologerId}`, {
        params: {
          page,
          sort
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Create a new review
  createReview: async (data: {
    astrologerId: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await axios.post(`${API_BASE_URL}/create`, data);
    return response.data;
  },

  // Edit a review
  editReview: async (
    reviewId: string,
    data: { rating: number; comment: string }
  ): Promise<Review> => {
    const response = await axios.patch(
      `${API_BASE_URL}/${reviewId}/edit`,
      data
    );
    return response.data;
  },

  // Add reply to a review
  addReply: async (
    reviewId: string,
    data: { comment: string }
  ): Promise<Review> => {
    const response = await axios.post(
      `${API_BASE_URL}/${reviewId}/reply`,
      data
    );
    return response.data;
  },

  // Edit a reply
  editReply: async (
    reviewId: string,
    replyId: string,
    data: { comment: string }
  ): Promise<Review> => {
    const response = await axios.patch(
      `${API_BASE_URL}/${reviewId}/reply/${replyId}/edit`,
      data
    );
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId: string): Promise<{ helpful: number; isHelpful: boolean }> => {
    const response = await axios.patch(`${API_BASE_URL}/${reviewId}/helpful`);
    return response.data;
  },
};