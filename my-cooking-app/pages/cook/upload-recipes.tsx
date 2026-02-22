"use client";

import { Input } from "@/components/input/Input";
import { TextArea } from "@/components/textArea/TextArea";
import { InputList } from "@/components/inputList/InputList";
import { useMemo, useState } from "react";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Option } from "@/components/dropdown/Dropdown.types";
import {
  cuisineOptions,
  recipeTypeOptions,
} from "@/components/dropdown/DropdownOptions";
import { ImageInput } from "@/components/imageInput/ImageInput";
import { Button } from "@/components/button/Button";
import { uploadRecipeSchema } from "../../zodSchema/uploadRecipeSchema";
import { uploadRecipe, uploadRecipeImage } from "@/fetch/fetch";
import { recipeDataFormating } from "@/utils/UploadRecipe.utils";
import { useAuth } from "@/context/AuthContext";
import { useBannerNotification } from "@/hooks/UseBannerNotification";
import { Banner } from "@/components/banner/Banner";

export default function UploadRecipes() {
  const { user } = useAuth();
  const { banner, closeBanner, showBanner } = useBannerNotification();

  const [isLoading, setIsLoading] = useState(false);

  // Feedback state
  const [status, setStatus] = useState<
    | "idle"
    | "validating"
    | "uploadingImage"
    | "uploadingRecipe"
    | "success"
    | "error"
  >("idle");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [selectedCuisine, setSelectedCuisine] = useState<Option<"cuisine">>(
    cuisineOptions[0],
  );
  const [selectedRecipeType, setSelectedRecipeType] =
    useState<Option<"recipeType">>(recipeTypeOptions[0]);
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasErrors = Object.values(errors).some((error) => error);

  if (!user) return null;

  // Progress includes image now (7 total)
  const completedCount = useMemo(() => {
    let count = 0;
    if (title.trim()) count += 1;
    if (description.trim()) count += 1;
    if (ingredients.some((v) => v.trim())) count += 1;
    if (steps.some((v) => v.trim())) count += 1;
    if (selectedCuisine.id !== "all") count += 1;
    if (selectedRecipeType.id !== "all") count += 1;
    if (image) count += 1;
    return count; // out of 7
  }, [
    title,
    description,
    ingredients,
    steps,
    selectedCuisine.id,
    selectedRecipeType.id,
    image,
  ]);

  const statusText = useMemo(() => {
    switch (status) {
      case "validating":
        return "Checking your recipe…";
      case "uploadingImage":
        return "Uploading image…";
      case "uploadingRecipe":
        return "Uploading recipe…";
      case "success":
        return "Upload complete ✅";
      case "error":
        return "Upload failed. Please try again.";
      default:
        return null;
    }
  }, [status]);

  const handleUploadRecipe = async () => {
    setIsLoading(true);
    setStatus("validating");

    const formData = {
      title,
      description,
      ingredients,
      steps,
      selectedCuisine: selectedCuisine.id,
      selectedRecipeType: selectedRecipeType.id,
      image,
    };

    const result = uploadRecipeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);

      setStatus("error");
      setIsLoading(false);

      showBanner(
        "Missing information",
        "Please fix the highlighted fields and try again.",
        "error",
      );
      return;
    }

    // Image is REQUIRED now
    if (!image) {
      setErrors((prev) => ({ ...prev, image: "Image is required." }));
      setStatus("error");
      setIsLoading(false);

      showBanner(
        "Missing image",
        "Please upload a recipe image to continue.",
        "error",
      );
      return;
    }

    setStatus("uploadingImage");

    const fullPath = await uploadRecipeImage(image, user.id);
    if (!fullPath) {
      showBanner(
        "Something went wrong",
        "Error uploading image. Please try again.",
        "error",
      );
      setStatus("error");
      setIsLoading(false);
      return;
    }

    const imagePath = fullPath.split("/").pop();

    const recipe = recipeDataFormating(formData, user.id, imagePath);

    try {
      setStatus("uploadingRecipe");
      await uploadRecipe(recipe);

      setStatus("success");
      showBanner(
        "Recipe Uploaded",
        "Your recipe has been uploaded successfully!",
        "success",
      );
    } catch (error) {
      showBanner(
        "Something went wrong",
        "Error uploading recipe. Please try again.",
        "error",
      );
      setStatus("error");
      setIsLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setIngredients([""]);
    setSteps([""]);
    setSelectedCuisine(cuisineOptions[0]);
    setSelectedRecipeType(recipeTypeOptions[0]);
    setImage(null);
    setErrors({});
    setIsLoading(false);

    setTimeout(() => setStatus("idle"), 1200);
  };

  return (
    <div>
      <h1 className="font-playfair font-bold text-[32px] leading-[120%] md:text-[40px] text-center mb-2 text-primary-text">
        Upload Your Recipe
      </h1>

      <p className="text-center text-sm text-primary-text opacity-80 mb-4">
        Follow the steps below to publish your recipe.
      </p>

      <div className="max-w-[360px] md:max-w-[720px] mx-auto mb-4 px-2">
        <div className="flex items-center justify-between text-xs text-primary-text">
          <span>
            <span className="font-semibold">*</span> Required fields
          </span>
          <span className="opacity-80">Step 1 → Step 2 → Step 3</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-primary-text">
          <span className="opacity-80">
            Progress: <span className="font-semibold">{completedCount}</span>/7
            filled
          </span>

          {statusText && (
            <span
              className={`font-semibold ${
                status === "error"
                  ? "text-error-border"
                  : status === "success"
                    ? "text-green-700"
                    : "text-primary-text"
              }`}
              aria-live="polite"
            >
              {statusText}
            </span>
          )}
        </div>
      </div>

      <div className="bg-section-bg shadow-md border border-input-border rounded-2xl flex flex-col items-center w-full max-w-[360px] md:max-w-[720px] mx-auto p-6 gap-8">
        {hasErrors && (
          <div className="w-full border border-error-border text-error-border bg-error p-3 rounded-2xl text-sm text-center">
            Some required fields are missing. Please fix the highlighted inputs
            below, then try uploading again.
          </div>
        )}

        {/* STEP 1 */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-primary-text font-playfair">
              Step 1: Basic Information
            </h2>
            <span className="text-xs text-primary-text opacity-80">
              Start here
            </span>
          </div>

          <div className="flex flex-col w-full gap-6 border-l-2 border-gray-300 pl-4">
            <Input
              label="Recipe Title *"
              placeholder="e.g. Delicious Pancakes"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
                setStatus("idle");
              }}
              error={errors.title}
            />

            <TextArea
              label="Recipe Description *"
              value={description}
              onChange={(value) => {
                setDescription(value);
                setErrors((prev) => ({ ...prev, description: "" }));
                setStatus("idle");
              }}
              maxLength={200}
              placeholder="Describe your recipe in a short and clear way..."
              error={errors.description}
            />

            <Dropdown
              label="Choose Cuisine *"
              options={cuisineOptions}
              onSelect={(opt) => {
                setSelectedCuisine(opt);
                setErrors((prev) => ({ ...prev, selectedCuisine: "" }));
                setStatus("idle");
              }}
              value={selectedCuisine}
            />

            <Dropdown
              label="Choose Recipe Type *"
              options={recipeTypeOptions}
              onSelect={(opt) => {
                setSelectedRecipeType(opt);
                setErrors((prev) => ({ ...prev, selectedRecipeType: "" }));
                setStatus("idle");
              }}
              value={selectedRecipeType}
            />
          </div>
        </div>

        {/* STEP 2 */}
        <div className="w-full border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-primary-text font-playfair">
              Step 2: Ingredients & Steps
            </h2>
            <span className="text-xs text-primary-text opacity-80">
              Up to 20 items
            </span>
          </div>

          <div className="flex flex-col w-full gap-6 border-l-2 border-gray-300 pl-4">
            <InputList
              label="Ingredients *"
              values={ingredients}
              onChange={(newValues) => {
                setIngredients(newValues);
                setErrors((prev) => ({ ...prev, ingredients: "" }));
                setStatus("idle");
              }}
              placeholder="e.g. 2 eggs, 1 cup flour"
              maxItems={20}
              error={errors.ingredients}
            />

            <InputList
              label="Instructions / Steps *"
              values={steps}
              onChange={(newValues) => {
                setSteps(newValues);
                setErrors((prev) => ({ ...prev, steps: "" }));
                setStatus("idle");
              }}
              placeholder="e.g. Mix ingredients, then bake for 20 minutes"
              maxItems={20}
              error={errors.steps}
            />
          </div>
        </div>

        {/* STEP 3 (Image REQUIRED now) */}
        <div className="w-full border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-primary-text font-playfair">
              Step 3: Add a Photo *
            </h2>
            <span className="text-xs text-primary-text opacity-80">
              Required
            </span>
          </div>

          <div className="flex flex-col w-full gap-4 border-l-2 border-gray-300 pl-4">
            <p className="text-xs text-primary-text opacity-80">
              Please upload a clear photo of your recipe. This is required to
              publish.
            </p>

            <ImageInput
              value={image}
              onChange={(file) => {
                setImage(file);
                setErrors((prev) => ({ ...prev, image: "" }));
                setStatus("idle");
              }}
              error={errors.image}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-2 w-full pt-2">
          <p className="text-xs text-primary-text opacity-80 text-center">
            Ready to publish? Click the button below.
          </p>

          <Button
            variant="primary"
            className="w-2/3 mx-auto mt-1"
            onClick={handleUploadRecipe}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {status === "uploadingImage"
              ? "Uploading Image..."
              : status === "uploadingRecipe"
                ? "Uploading Recipe..."
                : "Upload Recipe"}
          </Button>

          <p className="text-xs text-primary-text opacity-80 text-center">
            Required fields are marked with <span className="font-semibold">*</span>
          </p>
        </div>
      </div>

      {banner && (
        <div className="fixed bottom-4 right-4 z-50">
          <Banner
            bannerType={banner.bannerType}
            description={banner.description}
            title={banner.title}
            variant="simple"
            onCloseBanner={closeBanner}
          />
        </div>
      )}
    </div>
  );
}