"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import {
  getRecipeLikes,
  hasUserLikedRecipe,
  toggleRecipeLike,
} from "@/fetch/fetch";

interface LikeButtonProps {
  recipeId: string;
}

export const LikeButton = ({ recipeId }: LikeButtonProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      console.log("🔄 Fetching likes for recipe:", recipeId);

      try {
        const count = await getRecipeLikes(recipeId);
        console.log("👍 Total likes from DB:", count);
        setLikesCount(count);

        if (user) {
          console.log("👤 Checking if user liked:", user.id);
          const likedByUser = await hasUserLikedRecipe(recipeId, user.id);
          console.log("❤️ User liked?", likedByUser);
          setLiked(likedByUser);
        } else {
          console.log("⚠️ No user logged in");
        }
      } catch (err) {
        console.error("❌ Error fetching likes:", err);
      }
    };

    fetchLikes();
  }, [recipeId, user]);

  const handleLike = async () => {
    console.log("🖱️ Heart clicked");

    if (!user) {
      console.log("❌ No user — cannot like");
      return;
    }

    console.log("👤 User ID:", user.id);
    console.log("📌 Recipe ID:", recipeId);

    try {
      const result = await toggleRecipeLike(recipeId, user.id);
      console.log("📡 RPC result:", result);

      if (!result) {
        console.log("❌ No result returned from RPC");
        return;
      }

      console.log("✅ Updating state...");
      setLikesCount(result.number_of_likes);
      setLiked(result.liked);
    } catch (err) {
      console.error("❌ Error in handleLike:", err);
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