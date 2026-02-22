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

      setTimeout(() => {
        router.back();
      }, 900);
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
      {/* HEADER */}
      <header className="relative flex flex-col items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            flex items-center gap-2 p-2
            cursor-pointer
            transition duration-200
            hover:scale-110 hover:opacity-80
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            rounded-lg
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
          <span className="text-sm font-semibold text-primary-text">
            Back
          </span>
        </button>

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
            showImage
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
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

          {isCreator && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-red-500 font-medium mb-1">
                Delete your recipe
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={deleting}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  transition-all duration-200
                  ${
                    deleting
                      ? "bg-red-100 opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:bg-red-100 hover:scale-110 active:scale-95 text-red-500"
                  }
                `}
                aria-label="Delete Recipe"
                title="Delete recipe"
              >
                {deleting ? (
                  <span className="text-xs animate-pulse">...</span>
                ) : (
                  <TrashIcon className="w-6 h-6" />
                )}
              </button>
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