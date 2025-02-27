import React, { useState } from "react";
import { Reply } from "@/types/review.types";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Image from "next/image";

type ReplyCardProps = {
  reply: Reply;
  reviewId: string;
  currentUserId?: string;
  onEdit?: (
    reviewId: string,
    replyId: string,
    data: { comment: string }
  ) => Promise<void>;
};

const ReplyCard = ({ reply, reviewId, currentUserId: _currentUserId, onEdit }: ReplyCardProps) => {
  void _currentUserId; // no-op usage to prevent unused variable lint error
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(reply.comment);

  const handleEdit = async () => {
    if (onEdit) {
      await onEdit(reviewId, reply._id, { comment: editedComment });
      setIsEditing(false);
    }
  };

  return (
    <div className="ml-4 p-4 border-l">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Image
            src={reply.userId.avatar}
            alt={reply.userId.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-medium">{reply.userId.name}</span>
          <span className="text-sm text-black/60 ml-2">
            ({reply.userId.role})
          </span>
        </div>
        {reply.edited && (
          <span className="text-sm text-black/60">(edited)</span>
        )}
      </div>

      {isEditing ? (
        <div className="w-full">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <Button onClick={handleEdit} className="mt-2">
            Save Changes
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="mt-2 ml-2"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-black/80">{reply.comment}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-black/60">
              {format(new Date(reply.createdAt), "MMM dd, yyyy")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReplyCard;