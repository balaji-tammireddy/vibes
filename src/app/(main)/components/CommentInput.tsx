"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function CommentInput({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: (comment: any) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/post/comment", { postId, text });
      onCommentAdded(res.data.comment);
      setText("");
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="bg-zinc-900 border border-zinc-700 rounded-2xl px-3 py-1 text-sm text-white flex-1"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submitComment()}
        disabled={loading}
      />
      <button
        onClick={submitComment}
        className="text-blue-400 text-sm disabled:opacity-50 cursor-pointer"
        disabled={loading}
      >
        Post
      </button>
    </div>
  );
}