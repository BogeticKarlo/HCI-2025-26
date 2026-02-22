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

  // Progressive display
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

  // Progressive reveal
  useEffect(() => {
    if (!recipe) return;
    setShowImage(false);
    setShowIngredients(false);
    setShowInstructions(false);

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
    try {
      await deleteRecipe(recipe.id, user.id);
      router.back();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <article className="w-full max-w-[900px] lg:max-w-[1000px] bg-section-bg rounded-3xl p-10 lg:p-12 shadow-md text-body-text flex flex-col gap-6 relative mx-auto">
      {/* ---------------- Header Section ---------------- */}
      <header className="relative flex flex-col items-center gap-4 mb-8">
        {/* Back button (absolute left) */}
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 p-2 cursor-pointer transition duration-200 hover:scale-110 hover:opacity-80"
          title="Go back to recipes"
        >
          <Image
            src={backArrow}
            alt="Back"
            width={32}
            height={32}
            className="w-8 aspect-square"
          />
          <span className="text-sm font-semibold text-primary-text">Back</span>
        </button>

        {/* Centered title and metadata */}
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text font-playfair break-words">
            {recipe.title}
          </h1>
          <h3 className="text-primary-text text-sm md:text-base">
            <span className="font-playfair font-semibold text-text-muted">
              Cuisine:
            </span>{" "}
            <span className="font-normal">{recipe.cuisine}</span>
            <br />
            <span className="font-playfair font-semibold text-text-muted">
              Type:
            </span>{" "}
            <span className="font-normal">
              {recipe.recipe_type?.replace("_", " ")}
            </span>
          </h3>
        </div>
      </header>

      {/* Description */}
      <p className="text-sm leading-relaxed text-body-text">{recipe.description}</p>

      {/* Main Recipe Image */}
      {publicImageUrl && (
        <div
          className={`relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden transition-opacity duration-700 ${
            showImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={publicImageUrl}
            alt={recipe.title}
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>
      )}

      {/* Ingredients */}
      <section
        className={`transition-opacity duration-700 ${
          showIngredients ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-xl font-semibold mb-2 text-primary-text font-playfair">
          Ingredients
        </h2>
        <ul className="list-disc ml-5 text-sm flex flex-col gap-1">
          {recipe.ingredients.map((item, i) => (
            <li key={i} className="text-body-text">
              {item}
            </li>
          ))}
        </ul>
        <div className="w-24 h-20 mt-4 flex items-center justify-center">
          <Image
            src={CakeImage}
            alt="Cake"
            width={90}
            height={90}
            className="object-contain -rotate-12"
          />
        </div>
      </section>

      {/* Instructions */}
      <section
        className={`transition-opacity duration-700 ${
          showInstructions ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-xl font-semibold mb-2 text-primary-text font-playfair">
          Instructions
        </h2>
        <ol className="list-decimal ml-5 text-sm flex flex-col gap-1">
          {recipe.instructions.map((step, i) => (
            <li key={i} className="text-body-text">
              {step}
            </li>
          ))}
        </ol>
        <div className="w-24 h-20 mt-4 flex items-center justify-center">
          <Image
            src={SoupImage}
            alt="Soup"
            width={80}
            height={80}
            className="object-contain rotate-20"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-center text-sm text-body-text">
        <span>{author?.username?.split("@")[0]}</span>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Like button discoverability */}
          {!isCreator && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-text-muted mb-1">Like this recipe</span>
              <LikeButton recipeId={recipe.id} />
            </div>
          )}

          {/* Delete button discoverability */}
          {isCreator && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-text-muted mb-1">
                Delete your recipe
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:text-error-border"
                aria-label="Delete Recipe"
              >
                <TrashIcon className="w-7 h-7" />
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* Modal */}
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
