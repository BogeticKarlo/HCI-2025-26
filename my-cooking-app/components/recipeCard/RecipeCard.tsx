"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RecipeCardSkeleton } from "./RecipeSkeletonLoaderCard";
import { useState, useEffect } from "react";
import CakeImage from "../../public/assets/cake.png";
import SoupImage from "../../public/assets/soup.png";
import backArrow from "../../public/assets/backArrow.png";
import { TrashIcon } from "@/assets/TrashIcon";
import { Database } from "@/types/supabase";
import { fetchUserById, deleteRecipe } from "@/fetch/fetch";
import { useAuth } from "@/context/AuthContext";
import Modal from "../modal/Modal";
import { LikeButton } from "../LikeButton";

// Extend Recipe type with optional likes_count
type RecipeWithLikes = Database["public"]["Tables"]["recipes"]["Row"] & {
  likes_count?: number; // optional, defaults to 0 if missing
};
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function RecipeCard({
  recipe,
  isLoading,
}: {
  recipe?: RecipeWithLikes;
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

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setShowImage(true), 100));
    timers.push(setTimeout(() => setShowIngredients(true), 500));
    timers.push(setTimeout(() => setShowInstructions(true), 900));

    return () => timers.forEach(clearTimeout);
  }, [recipe]);

  if (isLoading || !recipe) return <RecipeCardSkeleton />;

  const publicImageUrl = `https://xhebsnwjpfcdttydwuhg.supabase.co/storage/v1/object/public/recipe-images/${recipe.author_id}/${recipe.image_url}`;

  const handleDelete = async () => {
    if (!user || !recipe) return;

    setDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteRecipe(recipe.id, user.id);
      setSuccessMessage("Recipe deleted successfully.");
      setTimeout(() => router.back(), 900);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setErrorMessage("Failed to delete recipe. Please try again.");
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <article
      className="
        w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-[1100px]
        mx-auto bg-section-bg rounded-3xl p-8 lg:p-12 shadow-md text-body-text
        flex flex-col gap-8 relative
      "
    >
      {/* BACK BUTTON - STICKY */}
      <button
        onClick={() => router.back()}
        className="
          fixed top-4 left-4 flex items-center gap-2 p-3
          rounded-full bg-white shadow-md z-50
          cursor-pointer transition duration-200
          hover:scale-110 hover:opacity-90
        "
        title="Go back"
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

      {/* HEADER */}
      <header className="relative flex flex-col items-center gap-4 mb-6">
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text font-playfair">
            {recipe.title}
          </h1>

          <h3 className="text-sm md:text-base text-primary-text">
            <span className="font-playfair font-semibold text-text-muted">
              Cuisine:
            </span>{" "}
            {recipe.cuisine}
            <br />
            <span className="font-playfair font-semibold text-text-muted">
              Type:
            </span>{" "}
            {recipe.recipe_type?.replace("_", " ")}
          </h3>

          {/* LIKE BUTTON - NEAR TITLE WITH COUNT */}
          {!isCreator && (
            <div className="flex items-center gap-2 mt-2">
              <LikeButton recipeId={recipe.id} />
              <span className="text-xs text-text-muted">
                {recipe.likes_count ?? 0} likes
              </span>
            </div>
          )}
        </div>

        {/* DELETE BUTTON - MOVED TO HEADER */}
        {isCreator && (
          <div className="absolute top-0 right-0 flex flex-col items-center mt-4 mr-4">
            <span className="text-xs text-red-500 font-medium mb-1">
              Delete Recipe
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={deleting}
              className={`
                flex items-center gap-1 px-3 py-2 rounded-full
                transition-all duration-200
                ${
                  deleting
                    ? "bg-red-100 opacity-60 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100 hover:scale-105 text-red-500"
                }
              `}
              aria-label="Delete Recipe"
            >
              <TrashIcon className="w-6 h-6" />
              {deleting ? (
                <span className="text-xs animate-pulse">Deleting...</span>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </div>
        )}
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
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading image...</span>
            </div>
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
          showIngredients ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-xl font-semibold mb-3 text-primary-text font-playfair border-b pb-1">
          Ingredients
        </h2>

        <ul className="list-disc ml-6 text-sm flex flex-col gap-1">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="w-24 h-20 mt-6 flex items-center justify-center">
          <Image
            src={CakeImage}
            alt="Decoration"
            width={90}
            height={90}
            className="object-contain -rotate-12"
          />
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section
        className={`transition-all duration-700 ${
          showInstructions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-xl font-semibold mb-3 text-primary-text font-playfair border-b pb-1">
          Instructions
        </h2>

        <ol className="list-decimal ml-6 text-sm flex flex-col gap-2">
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <div className="w-24 h-20 mt-6 flex items-center justify-center">
          <Image
            src={SoupImage}
            alt="Decoration"
            width={80}
            height={80}
            className="object-contain rotate-12"
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

      {/* FOOTER */}
      <footer className="flex justify-between items-center pt-4 border-t text-sm">
        <span className={author ? "" : "animate-pulse text-text-muted"}>
          {author ? author.username?.split("@")[0] : "Loading author..."}
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {!isCreator && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-text-muted mb-1">
                Like this recipe
              </span>
              <LikeButton recipeId={recipe.id} />
            </div>
          )}
        </div>
      </footer>

      {isModalOpen && (
        <Modal
          handleAction={handleDelete}
          setIsModalOpen={setIsModalOpen}
          title={
            deleting
              ? "Deleting recipe..."
              : "Are you sure you want to delete this recipe?"
          }
        />
      )}
    </article>
  );
}
