"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RecipeCardSkeleton } from "./RecipeSkeletonLoaderCard";
import {
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import CakeImage from "../../public/assets/cake.png";
import SoupImage from "../../public/assets/soup.png";
import backArrow from "../../public/assets/backArrow.png";
import { TrashIcon } from "@/assets/TrashIcon";
import { Database } from "@/types/supabase";
import { fetchUserById, deleteRecipe } from "@/fetch/fetch";
import { useAuth } from "@/context/AuthContext";
import Modal from "../modal/Modal";
import { LikeButton } from "../LikeButton";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function RecipeCard({
  recipe,
  isLoading,
}: {
  recipe?: Recipe;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [author, setAuthor] = useState<Profile>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Progressive reveal
  const [showImage, setShowImage] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Like wrapper -> click anywhere to trigger internal LikeButton click
  const likeWrapperRef = useRef<HTMLDivElement | null>(null);

  // Constraint: prevent rapid double-like toggles
  const [likeCooldown, setLikeCooldown] = useState(false);
  const likeCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const isCreator = user?.id === recipe?.author_id;

  useEffect(() => {
    if (!recipe?.author_id) return;

    const fetchData = async () => {
      try {
        const author = await fetchUserById(recipe.author_id);
        setAuthor(author);
      } catch (err) {
        console.error("Failed to fetch author", err);
      }
    };

    fetchData();
  }, [recipe?.author_id]);

  useEffect(() => {
    if (!recipe) return;

    setShowImage(false);
    setShowIngredients(false);
    setShowInstructions(false);
    setImageLoaded(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setShowImage(true), 100));
    timers.push(setTimeout(() => setShowIngredients(true), 500));
    timers.push(setTimeout(() => setShowInstructions(true), 900));

    return () => timers.forEach(clearTimeout);
  }, [recipe]);

  useEffect(() => {
    return () => {
      if (likeCooldownTimerRef.current)
        clearTimeout(likeCooldownTimerRef.current);
    };
  }, []);

  if (isLoading || !recipe) return <RecipeCardSkeleton />;

  const publicImageUrl = `https://xhebsnwjpfcdttydwuhg.supabase.co/storage/v1/object/public/recipe-images/${recipe.author_id}/${recipe.image_url}`;

  const startLikeCooldown = () => {
    setLikeCooldown(true);
    if (likeCooldownTimerRef.current)
      clearTimeout(likeCooldownTimerRef.current);
    likeCooldownTimerRef.current = setTimeout(() => setLikeCooldown(false), 450);
  };

  const triggerInnerLikeClick = () => {
    const root = likeWrapperRef.current;
    if (!root) return;
    const innerButton = root.querySelector("button") as HTMLButtonElement | null;
    innerButton?.click();
  };

  const handleLikeWrapperClick = (e: MouseEvent<HTMLDivElement>) => {
    if (likeCooldown) return;

    const root = likeWrapperRef.current;
    if (!root) return;

    const innerButton = root.querySelector("button") as HTMLButtonElement | null;

    if (
      innerButton &&
      e.target instanceof Node &&
      innerButton.contains(e.target)
    ) {
      startLikeCooldown();
      return;
    }

    triggerInnerLikeClick();
    startLikeCooldown();
  };

  const handleLikeWrapperKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (likeCooldown) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerInnerLikeClick();
      startLikeCooldown();
    }
  };

  const handleDelete = async () => {
    if (!user || !recipe) return;

    setDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteRecipe(recipe.id, user.id);

      setSuccessMessage("Recipe deleted successfully.");
      setIsModalOpen(false);

      setTimeout(() => {
        router.back();
      }, 900);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setErrorMessage("Failed to delete recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const deleteWrapperDisabled = deleting || isModalOpen;

  return (
    <article
      className="
        w-[95%]
        sm:w-[90%]
        md:w-[85%]
        lg:w-[75%]
        xl:w-[65%]
        max-w-[1100px]
        mx-auto
        bg-section-bg
        rounded-3xl
        p-8
        lg:p-12
        shadow-md
        text-body-text
        flex
        flex-col
        gap-8
        relative
      "
    >
      {/* TOP-RIGHT ACTIONS (moved here) */}
      <div className="absolute right-6 top-6 flex items-start gap-4 z-30">
        {!isCreator && (
          <div
            ref={likeWrapperRef}
            role="button"
            tabIndex={0}
            aria-label="Like this recipe"
            onClick={handleLikeWrapperClick}
            onKeyDown={handleLikeWrapperKeyDown}
            className={`
              flex flex-col items-center
              border border-accent/25
              rounded-xl px-4 py-3
              bg-white/50
              transition-all duration-200
              hover:border-accent hover:bg-white/70 hover:shadow-md hover:-translate-y-[1px] hover:scale-[1.02]
              active:scale-[0.98] active:translate-y-0
              cursor-pointer
              focus:outline-none
              focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
              select-none
              ${likeCooldown ? "opacity-90" : ""}
            `}
            title="Tap to like / tap again to unlike"
          >
            <span className="text-xs text-text-muted">Like</span>
            <span className="text-[11px] text-text-muted/80 mb-1">
              Tap to toggle
            </span>

            <LikeButton recipeId={recipe.id} />
          </div>
        )}

        {isCreator && (
          <button
            type="button"
            onClick={() => {
              if (!deleteWrapperDisabled) setIsModalOpen(true);
            }}
            disabled={deleteWrapperDisabled}
            title={
              deleteWrapperDisabled
                ? "Delete is currently unavailable"
                : "Delete recipe"
            }
            aria-label="Delete recipe"
            className={`
              group
              flex flex-col items-center
              border border-red-300/40
              rounded-xl px-4 py-3
              bg-white/50
              transition-all duration-200
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
              ${
                deleteWrapperDisabled
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:border-red-400 hover:bg-white/70 hover:shadow-md hover:-translate-y-[1px] hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
          >
            <span className="text-xs text-red-500 font-medium">Delete</span>
            <span className="text-[11px] text-text-muted/80 mb-1">
              Permanent
            </span>

            <span
              className={`
                w-10 h-10 flex items-center justify-center rounded-full
                transition-all duration-200
                ${
                  deleteWrapperDisabled
                    ? "bg-red-100"
                    : "text-red-500 group-hover:bg-red-100 group-hover:scale-110 active:scale-95"
                }
              `}
            >
              {deleting ? (
                <span className="text-xs animate-pulse">...</span>
              ) : (
                <TrashIcon className="w-6 h-6" />
              )}
            </span>
          </button>
        )}
      </div>

      {/* HEADER */}
      <header className="relative flex flex-col items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            flex items-center gap-2 px-3 py-2
            cursor-pointer
            border border-gray-300
            bg-white
            shadow-sm
            rounded-lg
            transition-all duration-200
            hover:scale-105 hover:shadow-md hover:border-accent
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
          "
          title="Go back"
          aria-label="Go back to previous page"
        >
          <Image
            src={backArrow}
            alt="Back"
            width={36}
            height={36}
            className="w-9 aspect-square"
          />
          <span className="text-sm font-semibold text-primary-text">Back</span>
        </button>

        <div className="flex flex-col items-center text-center gap-3 w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text font-playfair tracking-tight">
            {recipe.title}
          </h1>

          <h3 className="text-xs md:text-sm text-text-muted leading-relaxed">
            <span className="font-playfair font-semibold">Cuisine:</span>{" "}
            <span className="text-primary-text/90">{recipe.cuisine}</span>
            <span className="mx-2 text-text-muted/60">•</span>
            <span className="font-playfair font-semibold">Type:</span>{" "}
            <span className="text-primary-text/90">
              {recipe.recipe_type?.replace("_", " ")}
            </span>
          </h3>

          <div className="w-full border-t border-gray-200/70" />
        </div>
      </header>

      {/* DESCRIPTION */}
      <p className="text-sm leading-relaxed text-body-text">
        {recipe.description}
      </p>

      {/* IMAGE */}
      {publicImageUrl && (
        <div
          className={`relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden transition-all duration-700 ${
            showImage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          <Image
            src={publicImageUrl}
            alt={recipe.title}
            fill
            sizes="100%"
            onLoadingComplete={() => setImageLoaded(true)}
            className={`object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}

      {/* INGREDIENTS */}
      <section
        className={`transition-all duration-700 ${
          showIngredients
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center gap-3 mb-3 border-b pb-1">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-black text-xs font-bold">
            1
          </span>
          <h2 className="text-xl font-semibold text-primary-text font-playfair">
            Ingredients
          </h2>
        </div>

        <ul className="ml-1 text-sm flex flex-col gap-2">
          {recipe.ingredients.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg px-3 py-2 bg-white/40"
            >
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-body-text">{item}</span>
            </li>
          ))}
        </ul>

        <div className="w-24 h-20 mt-6 flex items-center justify-center">
          <Image
            src={CakeImage}
            alt="Decoration"
            width={84}
            height={84}
            className="object-contain -rotate-12 opacity-80"
          />
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section
        className={`transition-all duration-700 ${
          showInstructions
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center gap-3 mb-3 border-b pb-1">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-black text-xs font-bold">
            2
          </span>
          <h2 className="text-xl font-semibold text-primary-text font-playfair">
            Instructions
          </h2>
        </div>

        <ol className="ml-1 text-sm flex flex-col gap-2">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/60 border border-gray-200/70 text-xs font-semibold text-primary-text shrink-0">
                {index + 1}
              </span>
              <span className="rounded-lg px-3 py-2 bg-white/40 flex-1">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="w-24 h-20 mt-6 flex items-center justify-center">
          <Image
            src={SoupImage}
            alt="Decoration"
            width={76}
            height={76}
            className="object-contain rotate-12 opacity-80"
          />
        </div>
      </section>

      {/* FEEDBACK */}
      {(errorMessage || successMessage) && (
        <div className="transition-all duration-500">
          {errorMessage && (
            <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg shadow-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-300 text-green-700 text-sm px-4 py-2 rounded-lg shadow-sm">
              {successMessage}
            </div>
          )}
        </div>
      )}

      {/* FOOTER (author only now) */}
      <footer className="flex justify-between items-center pt-4 border-t text-sm">
        <span
          className={`${
            author
              ? "font-semibold text-primary-text"
              : "animate-pulse text-text-muted"
          }`}
        >
          {author ? author.username?.split("@")[0] : "Loading author..."}
        </span>
      </footer>

      {isModalOpen && (
        <Modal
          handleAction={handleDelete}
          setIsModalOpen={setIsModalOpen}
          title={
            deleting
              ? `Deleting "${recipe.title}"...`
              : `Delete "${recipe.title}"?`
          }
        />
      )}
    </article>
  );
}