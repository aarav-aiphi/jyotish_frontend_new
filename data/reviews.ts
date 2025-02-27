import { Review } from "@/types/review.types";

export const reviewsData: Review[] = [
  {
    _id: "1",
    userId: {
      _id: "user1",
      name: "John Doe",
      avatar: "/avatars/john.jpg",
      role: "Client"
    },
    astrologerId: "astro1",
    rating: 5,
    comment: "Excellent consultation! Very accurate predictions and helpful advice.",
    edited: false,
    helpful: [],
    editHistory: [],
    replies: [],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    _id: "2",
    userId: {
      _id: "user2",
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg",
      role: "Client"
    },
    astrologerId: "astro1",
    rating: 4.5,
    comment: "Very insightful reading. Would definitely recommend!",
    edited: false,
    helpful: [],
    editHistory: [],
    replies: [],
    createdAt: "2024-03-14T15:30:00Z",
    updatedAt: "2024-03-14T15:30:00Z"
  }
]; 