import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "../../assets/PlusCircleIcon";
import { Button } from "../button/Button";

export const NoRecipesCard = () => {
  const router = useRouter();

  const handleAddRecipeClick = () => {
    router.push("/cook/upload-recipes");
  };

  return (
    <div className="w-full max-w-lg bg-section-bg rounded-3xl p-10 shadow-lg text-center border border-border">
      <div className="text-5xl mb-4">🍳</div>

      <h2 className="font-playfair text-3xl font-bold text-primary-text mb-3">
        Your kitchen is empty!
      </h2>

      <p className="text-body-text mb-6 leading-relaxed">
        No recipes yet — not even a secret family dish 👀 Time to break the
        silence and cook up something amazing.
      </p>

      <div className="flex justify-center">
        <Button
          variant="primary"
          icon={<PlusCircleIcon className="w-5 h-5" />}
          onClick={handleAddRecipeClick}
        >
          Create your first recipe
        </Button>
      </div>

      <p className="text-text-muted text-sm mt-6">
        Even instant noodles deserve a recipe 😌
      </p>
    </div>
  );
};
