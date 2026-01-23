"use client";

import { Input } from "@/components/input/Input";
import { TextArea } from "@/components/textArea/TextArea";
import { InputList } from "@/components/inputList/InputList";
import { useEffect, useState } from "react";
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
import { set } from "zod";

export default function UploadRecipes() {
  const { user } = useAuth();

  const { banner, closeBanner, showBanner } = useBannerNotification();

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [selectedCuisine, setSelectedCuisine] = useState<Option<"cuisine">>(
    cuisineOptions[0]
  );
  const [selectedRecipeType, setSelectedRecipeType] = useState<
    Option<"recipeType">
  >(recipeTypeOptions[0]);
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
      imagePath = await uploadRecipeImage(image, user.id);
      if (!imagePath) {
        showBanner(
          "Something went wrong",
          "Error uploading image. Please try again.",
          "error"
        );
        setIsLoading(false);
        return;
      }
    }

    const recipe = recipeDataFormating(formData, user.id, imagePath);

    try {
      await uploadRecipe(recipe);
      showBanner(
        "Recipe Uploaded",
        "Your recipe has been uploaded successfully!",
        "success"
      );
    } catch (error) {
      showBanner(
        "Something went wrong",
        "Error uploading recipe. Please try again.",
        "error"
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
      <h1 className="font-playfair font-bold text-[32px] leading-[120%] md:text-[40px] text-center mb-10 text-primary-text">
        Upload Your Recipe
      </h1>

      <div className="bg-section-bg shadow-md border border-input-border rounded-2xl flex flex-col items-center w-full max-w-[360px] md:max-w-[720px] mx-auto p-4 gap-6">
        <h1 className="text-3xl font-bold text-primary-text font-playfair">
          Your Recipe...
        </h1>

        <div className="flex flex-col w-9/10 gap-6">
          <Input
            label="Recipe Title"
            placeholder="Delicious Pancakes"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            error={errors.title}
          />

          <TextArea
            label="Recipe description"
            value={description}
            onChange={(value) => {
              setDescription(value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            maxLength={200}
            placeholder="Describe your recipe in brief..."
            error={errors.description}
          />

          <InputList
            label="Ingredients"
            values={ingredients}
            onChange={(newValues) => {
              setIngredients(newValues);
              setErrors((prev) => ({ ...prev, ingredients: "" }));
            }}
            placeholder="e.g. 2 eggs"
            maxItems={20}
            error={errors.ingredients}
          />

          <InputList
            label="Instructions / Steps"
            values={steps}
            onChange={(newValues) => {
              setSteps(newValues);
              setErrors((prev) => ({ ...prev, steps: "" }));
            }}
            placeholder="e.g. boil water"
            maxItems={20}
            error={errors.steps}
          />

          <Dropdown
            label="Choose Cuisine"
            options={cuisineOptions}
            onSelect={setSelectedCuisine}
            value={selectedCuisine}
          />

          <Dropdown
            label="Choose Recipe Type"
            options={recipeTypeOptions}
            onSelect={setSelectedRecipeType}
            value={selectedRecipeType}
          />

          <ImageInput
            value={image}
            onChange={(file) => {
              setImage(file);
              setErrors((prev) => ({ ...prev, image: "" }));
            }}
            error={errors.image}
          />
        </div>

        <Button
          variant="primary"
          className="w-1/2 mx-auto mt-4"
          onClick={handleUploadRecipe}
          isLoading={isLoading}
        >
          Upload Recipe
        </Button>
        {hasErrors && (
          <div className="w-9/10 border border-error-border text-error-border bg-error p-3 rounded-2xl flex items-center justify-center">
            Please fill in the recipe sheet before uploading
          </div>
        )}
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
