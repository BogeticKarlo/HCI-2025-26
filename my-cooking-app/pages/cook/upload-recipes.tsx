"use client";

import { Input } from "@/components/input/Input";
import { TextArea } from "@/components/textArea/TextArea";
import { InputList } from "@/components/inputList/InputList";
import { useState } from "react";
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

  const handleUploadRecipe = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    let imagePath = null;
    if (image) {
      const fullPath = await uploadRecipeImage(image, user.id);
      if (!fullPath) {
        showBanner(
          "Something went wrong",
          "Error uploading image. Please try again.",
          "error",
        );
        setIsLoading(false);
        return;
      }
      imagePath = fullPath.split("/").pop();
    }

    const recipe = recipeDataFormating(formData, user.id, imagePath);

    try {
      await uploadRecipe(recipe);
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

    setIsLoading(false);
  };

  return (
    <div>
      {/* PAGE TITLE + INSTRUCTION (Discoverability) */}
      <h1 className="font-playfair font-bold text-[32px] leading-[120%] md:text-[40px] text-center mb-2 text-primary-text">
        Upload Your Recipe
      </h1>

      <p className="text-center text-sm text-secondary-text mb-8">
        Fill out the form below to share your recipe with the community.
      </p>

      {/* FORM CARD */}
      <div className="bg-section-bg shadow-md border border-input-border rounded-2xl flex flex-col items-center w-full max-w-[360px] md:max-w-[720px] mx-auto p-6 gap-8">
        {/* SECTION: BASIC INFO */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-primary-text font-playfair mb-1">
            Basic Information
          </h2>
          <p className="text-xs text-secondary-text mb-4">
            Start with the core details of your recipe.
          </p>

          <div className="flex flex-col w-full gap-6">
            <Input
              label="Recipe Title *"
              placeholder="e.g. Delicious Pancakes"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              error={errors.title}
            />

            <TextArea
              label="Recipe Description *"
              value={description}
              onChange={(value) => {
                setDescription(value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              maxLength={200}
              placeholder="Describe your recipe in a short and clear way..."
              error={errors.description}
            />

            <Dropdown
              label="Choose Cuisine *"
              options={cuisineOptions}
              onSelect={setSelectedCuisine}
              value={selectedCuisine}
            />

            <Dropdown
              label="Choose Recipe Type *"
              options={recipeTypeOptions}
              onSelect={setSelectedRecipeType}
              value={selectedRecipeType}
            />
          </div>
        </div>

        {/* SECTION: INGREDIENTS & STEPS */}
        <div className="w-full border-t pt-6">
          <h2 className="text-xl font-semibold text-primary-text font-playfair mb-1">
            Ingredients & Instructions
          </h2>
          <p className="text-xs text-secondary-text mb-4">
            Add all ingredients and step-by-step instructions. You can add up to
            20 items.
          </p>

          <div className="flex flex-col w-full gap-6">
            <InputList
              label="Ingredients *"
              values={ingredients}
              onChange={(newValues) => {
                setIngredients(newValues);
                setErrors((prev) => ({ ...prev, ingredients: "" }));
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
              }}
              placeholder="e.g. Mix ingredients, then bake for 20 minutes"
              maxItems={20}
              error={errors.steps}
            />
          </div>
        </div>

        {/* SECTION: IMAGE */}
        <div className="w-full border-t pt-6">
          <h2 className="text-xl font-semibold text-primary-text font-playfair mb-1">
            Recipe Image (Optional)
          </h2>
          <p className="text-xs text-secondary-text mb-4">
            Upload a photo to make your recipe more appealing.
          </p>

          <ImageInput
            value={image}
            onChange={(file) => {
              setImage(file);
              setErrors((prev) => ({ ...prev, image: "" }));
            }}
            error={errors.image}
          />
        </div>

        {/* PRIMARY ACTION (More Discoverable CTA) */}
        <div className="flex flex-col items-center gap-2 w-full">
          <Button
            variant="primary"
            className="w-2/3 mx-auto mt-2"
            onClick={handleUploadRecipe}
            isLoading={isLoading}
          >
            Upload Recipe
          </Button>

          <p className="text-xs text-secondary-text text-center">
            Make sure all required fields (*) are filled before uploading.
          </p>
        </div>

        {/* GLOBAL ERROR FEEDBACK */}
        {hasErrors && (
          <div className="w-full border border-error-border text-error-border bg-error p-3 rounded-2xl flex items-center justify-center text-sm text-center">
            Please complete all required fields before uploading your recipe.
          </div>
        )}
      </div>

      {/* BANNER NOTIFICATION */}
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