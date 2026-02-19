"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import { likeRecipe, unlikeRecipe, hasUserLikedRecipe, getRecipeLikes } from "@/fetch/fetch";

interface LikeButtonProps {
  recipeId: string;
}

export const LikeButton = ({ recipeId }: LikeButtonProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch likes count and whether the current user liked the recipe
  const fetchLikes = async () => {
    const count = await getRecipeLikes(recipeId);
    setLikesCount(count);

    if (user) {
      const likedByUser = await hasUserLikedRecipe(recipeId, user.id);
      setLiked(likedByUser);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [recipeId, user]);

  const handleLike = async () => {
    if (!user || loading) return;

    setLoading(true);

    if (liked) {
      const success = await unlikeRecipe(recipeId, user.id);
      if (success) {
        setLikesCount((prev) => Math.max(prev - 1, 0));
        setLiked(false);
      }
    } else {
      const success = await likeRecipe(recipeId, user.id);
      if (success) {
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1 text-body-text">
      <button
        onClick={handleLike}
        disabled={loading}
        className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
      >
        <HeartIcon className={`w-7 h-7 ${liked ? "text-red-500" : ""}`} />
      </button>
      <span>{likesCount}</span>
    </div>
  );
};
