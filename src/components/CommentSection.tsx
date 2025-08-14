"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { User as UserNext } from "next-auth";

import { User } from "@/DTOs/User";
import { Comment } from "@/DTOs/Comment";
import noAvatar from "@/assets/images/No_avatar.png";

interface CommentWithAuthor extends Comment {
  user: User;
}

type CommentSectionProps = {
  initialComments: CommentWithAuthor[];
  bookId: string;
  currentUser: (UserNext & { id: string }) | null;
};

export function CommentSection({ initialComments, bookId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;

    startTransition(async () => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newCommentText, bookId })
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments(prev => [
          ...prev,
          { ...createdComment, user: { ...currentUser, name: currentUser.name || "User" } }
        ]);
        setNewCommentText("");
      } else {
        console.error("Couldn't add a comment.");
      }
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    const originalComments = comments;
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        alert("Couldn't delete comment.");
        setComments(originalComments);
      }
    } catch (error) {
      console.error(error);
      setComments(originalComments);
    }
  };

  return (
    <div className="pt-8 mt-8 border-t">
      <h3 className="text-2xl font-bold text-gray-800">Comments ({comments.length})</h3>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="mt-6">
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder="Leave your comment..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-block px-6 py-2 mt-2 text-white rounded-md bg-primary hover:bg-primary-700 disabled:bg-gray-400"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-4">
            <Image
              src={comment.user.avatar || noAvatar}
              alt={comment.user.name}
              width={40}
              height={40}
              className="rounded-full mt-[8px]"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-gray-900">{comment.user.name}</p>
                <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                {currentUser?.id === comment.user.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-1 text-gray-700">{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
      </div>
    </div>
  );
}
