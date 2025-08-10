"use client";

import { useEffect } from "react";

export default function PostModal({ post, onClose }: any) {
  useEffect(() => {
    const handleClick = (e: any) => {
      if (e.target.id === "modal-overlay") onClose();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
    >
      <div className="bg-zinc-900 p-4 rounded-lg w-[90%] md:w-[600px] max-h-[90%] overflow-y-auto relative">
        {/* Top bar with 3 dots */}
        <div className="flex justify-end">
          <button className="text-white hover:text-red-500">•••</button>
        </div>

        {/* Post content */}
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full rounded-md object-cover mt-2"
        />
        <p className="mt-4 text-white">{post.caption}</p>

        {/* Add comment section here if needed */}
      </div>
    </div>
  );
}
