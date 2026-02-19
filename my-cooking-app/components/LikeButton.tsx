"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import { getRecipeLikes, hasUserLikedRecipe, toggleRecipeLike } from "@/fetch/fetch";

interface LikeButtonProps {
  recipeId: string;
}

export const LikeButton = ({ recipeId }: LikeButtonProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      const count = await getRecipeLikes(recipeId);
      setLikesCount(count);

      if (user) {
        const likedByUser = await hasUserLikedRecipe(recipeId, user.id);
        setLiked(likedByUser);
      }
    };

    fetchLikes();
  }, [recipeId, user]);

  const handleLike = async () => {
    if (!user) return;

    const result = await toggleRecipeLike(recipeId, user.id);
    if (result) {
      setLikesCount(result.number_of_likes);
      setLiked(result.liked);
    }
  };

  return (
    <div className="flex items-center gap-1 text-body-text">
      <button
        onClick={handleLike}
        className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <HeartIcon className={`w-7 h-7 ${liked ? "text-red-500" : ""}`} />
      </button>
      <span>{likesCount}</span>
    </div>
  );
};
