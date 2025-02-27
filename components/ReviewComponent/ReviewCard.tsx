import React, { useState } from "react";
import Rating from "../ui/Rating";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Review } from "@/lib/reviewService";
import ReplyCard from "./ReplyCard";
import { useToast } from "../ui/use-toast";
import Image from "next/image";

interface ReviewCardProps {
  data: Review;
  className?: string;
  isAction?: boolean;
  isDate?: boolean;
  onEdit?: (reviewId: string, data: { rating: number; comment: string }) => Promise<void>;
  onReply?: (reviewId: string, comment: string) => Promise<void>;
  onMarkHelpful?: (reviewId: string) => Promise<void>;
  currentUserId?: string;
  onEditReply?: (reviewId: string, replyId: string, data: { comment: string }) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  data,
  className,
  isAction = false,
  isDate = false,
  onEdit,
  onReply,
  onMarkHelpful,
  currentUserId,
  onEditReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(data.rating);
  const [editedComment, setEditedComment] = useState(data.comment);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEdit = async () => {
    if (!onEdit) return;
    
    setIsSubmitting(true);
    try {
      await onEdit(data._id, {
        rating: editedRating,
        comment: editedComment.trim(),
      });
      setIsEditing(false);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!onReply || !replyComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(data._id, replyComment.trim());
      setReplyComment("");
      setShowReplyInput(false);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReviewOwner = data.userId._id === currentUserId;
  const hasMarkedHelpful = data.helpful.some(user => user._id === currentUserId);

  return (
    <div
      className={cn([
        "relative bg-white flex flex-col items-start aspect-auto border border-black/10 rounded-[20px] p-6 sm:px-8 sm:py-7",
        className,
      ])}
    >
      <div className="w-full flex items-center justify-between mb-3">
        {isEditing ? (
          <Rating
            initialValue={editedRating}
            allowFraction
            SVGclassName="inline-block"
            size={23}
            onClick={setEditedRating}
          />
        ) : (
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            size={23}
            readonly
          />
        )}
        {isAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IoEllipsisHorizontal className="text-black/40 text-2xl" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isReviewOwner && (
                <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel Edit" : "Edit Review"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowReplyInput(!showReplyInput)}>
                Reply
              </DropdownMenuItem>
              {!hasMarkedHelpful && (
                <DropdownMenuItem onClick={() => onMarkHelpful?.(data._id)}>
                  Mark as Helpful ({data.helpful.length})
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center mb-2">
        <div className="flex items-center">
          <Image
            src={data.userId.avatar}
            alt={data.userId.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <strong className="text-black sm:text-xl">{data.userId.name}</strong>
          {data.userId.role && (
            <span className="text-sm text-black/60 ml-2">
              ({data.userId.role})
            </span>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="w-full space-y-4">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none"
            disabled={isSubmitting}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm sm:text-base text-black/60">{data.comment}</p>
      )}

      {showReplyInput && (
        <div className="w-full mt-4 space-y-4">
          <textarea
            value={replyComment}
            onChange={(e) => setReplyComment(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-3 border rounded-lg resize-none"
            disabled={isSubmitting}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleReply}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Reply"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReplyInput(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {data.replies.length > 0 && (
        <div className="w-full mt-4 space-y-4">
          {data.replies.map((reply) => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              reviewId={data._id}
              currentUserId={currentUserId}
              onEdit={onEditReply}
            />
          ))}
        </div>
      )}

      {isDate && (
        <p className="text-black/60 text-sm font-medium mt-4">
          Posted on {format(new Date(data.createdAt), "MMM dd, yyyy")}
          {data.edited && " (edited)"}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;