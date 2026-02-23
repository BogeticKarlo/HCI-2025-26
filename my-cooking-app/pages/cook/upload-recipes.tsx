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

  /* ---------------- CONSTRAINTS (Norman) ----------------
   * 1) Disable Upload until all required fields are plausibly complete (prevents slips).
   * 2) Show a clear “what’s missing” checklist (reduces trial & error).
   * 3) Hard-stop if user tries anyway (e.g., Enter key or custom button behavior).
   * 4) Treat list fields as valid only if they contain at least 1 non-empty item.
   */

  const trimmedIngredients = useMemo(
    () => ingredients.map((v) => v.trim()).filter(Boolean),
    [ingredients],
  );
  const trimmedSteps = useMemo(
    () => steps.map((v) => v.trim()).filter(Boolean),
    [steps],
  );

  const trimmedIngredientsCount = trimmedIngredients.length;
  const trimmedStepsCount = trimmedSteps.length;

  const missingItems = useMemo(() => {
    const missing: string[] = [];
    if (!title.trim()) missing.push("Title");
    if (!description.trim()) missing.push("Description");
    if (selectedCuisine.id === "all") missing.push("Cuisine");
    if (selectedRecipeType.id === "all") missing.push("Recipe type");
    if (trimmedIngredientsCount === 0) missing.push("At least 1 ingredient");
    if (trimmedStepsCount === 0) missing.push("At least 1 step");
    if (!image) missing.push("Photo");
    return missing;
  }, [
    title,
    description,
    selectedCuisine.id,
    selectedRecipeType.id,
    trimmedIngredientsCount,
    trimmedStepsCount,
    image,
  ]);

  const canAttemptSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      selectedCuisine.id !== "all" &&
      selectedRecipeType.id !== "all" &&
      trimmedIngredientsCount > 0 &&
      trimmedStepsCount > 0 &&
      !!image &&
      !isLoading
    );
  }, [
    title,
    description,
    selectedCuisine.id,
    selectedRecipeType.id,
    trimmedIngredientsCount,
    trimmedStepsCount,
    image,
    isLoading,
  ]);

  // Progress includes image now (7 total)
  const completedCount = useMemo(() => {
    let count = 0;
    if (title.trim()) count += 1;
    if (description.trim()) count += 1;
    if (trimmedIngredientsCount > 0) count += 1;
    if (trimmedStepsCount > 0) count += 1;
    if (selectedCuisine.id !== "all") count += 1;
    if (selectedRecipeType.id !== "all") count += 1;
    if (image) count += 1;
    return count; // out of 7
  }, [
    title,
    description,
    trimmedIngredientsCount,
    trimmedStepsCount,
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

  // ---------------- KNOWLEDGE IN THE WORLD (Norman) ----------------
  // 1) Make system expectations visible: examples + format hints live on the page.
  // 2) Make current state visible: “Preview summary” + counts + “selected image” indicator.
  // 3) Make errors recoverable: “What’s missing” checklist + per-field clearing on change.

  const cuisinePreview =
    selectedCuisine?.id !== "all" ? selectedCuisine.label : "—";
  const typePreview =
    selectedRecipeType?.id !== "all" ? selectedRecipeType.label : "—";

  const applyConstraintErrors = () => {
    setErrors((prev) => ({
      ...prev,
      ...(title.trim() ? {} : { title: prev.title || "Title is required." }),
      ...(description.trim()
        ? {}
        : { description: prev.description || "Description is required." }),
      ...(selectedCuisine.id !== "all"
        ? {}
        : { selectedCuisine: prev.selectedCuisine || "Cuisine is required." }),
      ...(selectedRecipeType.id !== "all"
        ? {}
        : {
            selectedRecipeType:
              prev.selectedRecipeType || "Recipe type is required.",
          }),
      ...(trimmedIngredientsCount > 0
        ? {}
        : {
            ingredients:
              prev.ingredients || "Add at least 1 ingredient (not empty).",
          }),
      ...(trimmedStepsCount > 0
        ? {}
        : { steps: prev.steps || "Add at least 1 step (not empty)." }),
      ...(image ? {} : { image: prev.image || "Image is required." }),
    }));
  };

  const handleUploadRecipe = async () => {
    if (!canAttemptSubmit) {
      setStatus("error");
      applyConstraintErrors();

      showBanner(
        "Not ready to upload",
        `Please complete: ${missingItems.join(", ")}.`,
        "error",
      );
      return;
    }

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

      {/* KNOWLEDGE IN THE WORLD: Live preview summary */}
      <div className="max-w-[360px] md:max-w-[720px] mx-auto mb-6 px-2">
        <div className="border border-gray-200 rounded-2xl bg-white/60 p-4">
          <p className="text-sm font-semibold text-primary-text mb-2">
            Preview summary
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs text-primary-text">
            <div className="flex flex-col">
              <span className="opacity-80">Title</span>
              <span className="font-semibold">{title.trim() ? title : "—"}</span>
            </div>

            <div className="flex flex-col">
              <span className="opacity-80">Photo</span>
              <span className="font-semibold">{image ? "Selected ✅" : "Not selected"}</span>
            </div>

            <div className="flex flex-col">
              <span className="opacity-80">Cuisine</span>
              <span className="font-semibold">{cuisinePreview}</span>
            </div>

            <div className="flex flex-col">
              <span className="opacity-80">Type</span>
              <span className="font-semibold">{typePreview}</span>
            </div>

            <div className="flex flex-col">
              <span className="opacity-80">Ingredients</span>
              <span className="font-semibold">{trimmedIngredientsCount} items</span>
            </div>

            <div className="flex flex-col">
              <span className="opacity-80">Steps</span>
              <span className="font-semibold">{trimmedStepsCount} steps</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-primary-text opacity-80">
            This is what your recipe page will show after upload.
          </p>
        </div>
      </div>

      <div className="bg-section-bg shadow-md border border-input-border rounded-2xl flex flex-col items-center w-full max-w-[360px] md:max-w-[720px] mx-auto p-6 gap-8">
        {/* KNOWLEDGE IN THE WORLD: "what's missing" checklist (concrete guidance) */}
        {!canAttemptSubmit && missingItems.length > 0 && (
          <div className="w-full border border-gray-300 bg-white/60 p-3 rounded-2xl text-sm text-center text-primary-text">
            <span className="font-semibold">To upload, complete:</span>{" "}
            {missingItems.join(", ")}.
          </div>
        )}

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
            {/* KNOWLEDGE IN THE WORLD: Example + expectation */}
            <p className="text-xs text-primary-text opacity-80">
              Tip: Use a clear title people would search for (e.g. “Fluffy Pancakes”).
            </p>

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
              placeholder="What makes it good? Mention time, taste, and key ingredients..."
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
            {/* KNOWLEDGE IN THE WORLD: Format hint */}
            <p className="text-xs text-primary-text opacity-80">
              Tip: Ingredients work best with quantity + unit (e.g. “200g flour”, “2 eggs”).
            </p>

            <InputList
              label="Ingredients *"
              values={ingredients}
              onChange={(newValues) => {
                setIngredients(newValues);
                setErrors((prev) => ({ ...prev, ingredients: "" }));
                setStatus("idle");
              }}
              placeholder="e.g. 2 eggs, 200g flour"
              maxItems={20}
              error={errors.ingredients}
            />

            {/* KNOWLEDGE IN THE WORLD: Steps hint */}
            <p className="text-xs text-primary-text opacity-80">
              Tip: Write steps as short actions (e.g. “Mix”, “Bake”, “Serve”).
            </p>

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

        {/* STEP 3 (Image REQUIRED) */}
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
            {/* KNOWLEDGE IN THE WORLD: Quality guidance */}
            <p className="text-xs text-primary-text opacity-80">
              Tip: Use a bright photo where the dish is centered and clearly visible.
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
            disabled={!canAttemptSubmit}
            title={
              canAttemptSubmit
                ? "Upload your recipe"
                : `Complete: ${missingItems.join(", ")}`
            }
          >
            {status === "uploadingImage"
              ? "Uploading Image..."
              : status === "uploadingRecipe"
                ? "Uploading Recipe..."
                : "Upload Recipe"}
          </Button>

          <p className="text-xs text-primary-text opacity-80 text-center">
            Required fields are marked with{" "}
            <span className="font-semibold">*</span>
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