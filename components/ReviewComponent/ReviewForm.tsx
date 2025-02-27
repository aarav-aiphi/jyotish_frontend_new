import React, { useState } from "react";
import { Dialog } from '@headlessui/react';
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Rating from "../ui/Rating";
import { reviewService } from "@/lib/reviewService";
import { useToast } from "../ui/use-toast";

interface ReviewFormProps {
  astrologerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  astrologerId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        astrologerId,
        rating,
        comment: comment.trim(),
      });
      
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error instanceof Error ? error.message : "Failed to submit review"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <Rating
              initialValue={rating}
              allowFraction
              SVGclassName="inline-block"
              size={30}
              onClick={(value) => setRating(value)}
            />
            <span className="text-sm text-black/60 mt-2">
              {rating > 0 ? `You rated ${rating} stars` : "Select rating"}
            </span>
          </div>
          
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black/10"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
