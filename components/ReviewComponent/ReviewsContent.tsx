import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { useToast } from "@/components/ui/use-toast";
import { reviewService, Review } from "@/lib/reviewService";

interface ReviewsContentProps {
  astrologerId: string;
  currentUserId?: string;
}

const ReviewsContent: React.FC<ReviewsContentProps> = ({
  astrologerId,
  currentUserId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAstrologerReviews(astrologerId, currentPage, sortBy);
      if (currentPage === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      setTotalReviews(data.pagination.total);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [astrologerId, currentPage, sortBy, toast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleEdit = async (reviewId: string, data: { rating: number; comment: string }) => {
    try {
      await reviewService.editReview(reviewId, data);
      await fetchReviews();
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (reviewId: string, comment: string) => {
    try {
      await reviewService.addReply(reviewId, { comment });
      await fetchReviews();
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const result = await reviewService.markHelpful(reviewId);
      await fetchReviews();
      toast({
        title: "Success",
        description: result.isHelpful 
          ? "Review marked as helpful" 
          : "Review unmarked as helpful",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark review as helpful",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
            All Reviews
          </h3>
          <span className="text-sm sm:text-base text-black/60">
            ({totalReviews})
          </span>
        </div>
        
        <div className="flex items-center space-x-2.5">
          <Select value={sortBy} onValueChange={setSortBy}>
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
            onClick={() => setIsReviewFormOpen(true)}
          >
            Write a Review
          </Button>
        </div>
      </div>

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
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onReply={handleReply}
                onMarkHelpful={handleMarkHelpful}
              />
            ))}
          </div>

          {reviews.length < totalReviews && (
            <div className="w-full text-center">
              <Button
                variant="outline"
                className="inline-block w-[230px] px-11 py-4 rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
                onClick={() => setCurrentPage(prev => prev + 1)}
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
              <p className="text-black/60">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </>
      )}

      <ReviewForm
        astrologerId={astrologerId}
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
};

export default ReviewsContent;
