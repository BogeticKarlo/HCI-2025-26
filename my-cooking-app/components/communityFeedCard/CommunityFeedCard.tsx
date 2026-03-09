// components/community/CommunityFeedCard.tsx
"use client";

import Image from "next/image";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import { FC } from "react";
import { formatTimeSince } from "./CommunityFeedCard.utils";
import { CommunityFeedCardProps } from "./CommunityFeedCard.types";

export const CommunityFeedCard: FC<CommunityFeedCardProps> = ({
  story,
  onToggleLike,
}) => {
  const {
    date,
    createdBy,
    title,
    description,
    imageUrl,
    numberOfLikes,
    haveUserLiked,
  } = story;

  const timeAgo = formatTimeSince(date);

  const handleLikeClick = () => {
    if (onToggleLike) onToggleLike(story);
  };

  return (
    <article
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        bg-section-bg 
        rounded-2xl
        px-4 py-3
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
      "
    >
      {/* Left: avatar + text */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Simple avatar placeholder – swap with real avatar if you have it */}
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-text font-semibold shrink-0">
          {createdBy.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Username + time */}
          <div className="flex flex-col items-baseline mb-4">
            <h3 className="font-playfair font-semibold text-xl sm:text-[26px] leading-snug text-primary-text truncate">
              {createdBy}
            </h3>
            <span className="text-sm sm:text-[16px] text-body-text">
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-playfair font-semibold text-xl sm:text-[26px] leading-snug text-primary-text">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-[16px] text-body-text leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Right: image + likes */}
      <div className="flex items-center gap-4 self-start sm:self-center">
        {/* Recipe image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Likes */}
        <div className="flex items-center gap-1 text-body-text">
          <button
            type="button"
            onClick={handleLikeClick}
            className="
              w-8 h-8 
              flex items-center justify-center
              transition-all duration-200
              hover:scale-110 active:scale-95
              cursor-pointer
            "
            aria-label={haveUserLiked ? "Unlike story" : "Like story"}
          >
            <HeartIcon
              className={`w-5 h-5 ${
                haveUserLiked ? "text-red-500" : "text-body-text"
              }`}
            />
          </button>
          <span className="text-sm sm:text-[16px] text-body-text">
            {numberOfLikes}
          </span>
        </div>
      </div>
    </article>
  );
};
