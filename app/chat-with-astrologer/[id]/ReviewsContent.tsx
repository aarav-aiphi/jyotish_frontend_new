"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewCard from "@/components/ReviewComponent/ReviewCard";
import axios from "axios";
import { Review } from "@/lib/reviewService";

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    perPage: number;
  };
}

interface ReviewsContentProps {
  astrologerId: string;
  currentUserId: string;
}

const ReviewsContent = ({ astrologerId }: ReviewsContentProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ReviewsResponse>(
        `http://localhost:7000/api/v1/reviews/astrologer/${astrologerId}`,
        { params: { page: currentPage, sort: sortBy } }
      );
      if (currentPage === 1) {
        setReviews(response.data.reviews);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }
      setTotalReviews(response.data.pagination.total);
      setError(null);
    } catch {
      setError("Failed to fetch reviews");
      console.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  }, [astrologerId, sortBy, currentPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); 
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const response = await axios.post("http://localhost:7000/api/v1/reviews/create", {
        astrologerId,
        rating: newReviewRating,
        comment: newReviewComment,
      });
      setReviews(prev => [response.data, ...prev]);
      setTotalReviews(prev => prev + 1);
      setNewReviewRating(5);
      setNewReviewComment('');
      setShowReviewForm(false);
      setReviewError(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewError("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => fetchReviews()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="w-[70%]  mx-auto">
      <div className=" flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
            All Reviews
          </h3>
          <span className="text-sm sm:text-base text-black/60">
            ({totalReviews})
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-relevant">Most Relevant</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
            onClick={handleWriteReview}
          >
            Write a Review
          </Button>
        </div>
      </div>

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Rating</label>
            <select
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Comment</label>
            <textarea
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
              rows={3}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
          <div className="flex space-x-3">
            <Button type="submit" disabled={submittingReview} className="bg-black text-white">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading && currentPage === 1 ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                data={review}
                isAction={true}
                isDate={true}
              />
            ))}
          </div>

          {reviews.length < totalReviews && (
            <div className="w-full px-4 sm:px-0 text-center">
              <Button
                variant="outline"
                className="inline-block w-[230px] px-11 py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                    Loading...
                  </span>
                ) : (
                  "Load More Reviews"
                )}
              </Button>
            </div>
          )}

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-black/60">No reviews yet</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewsContent;