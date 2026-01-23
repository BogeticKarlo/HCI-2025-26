import { type BannerType } from "./Banner.types";

const buttonText: Record<BannerType, string> = {
  success: "Undo",
  error: "Retry",
};

const bannerStyle: Record<BannerType, string> = {
  success: "border-success-border bg-success",
  error: "border-error-border bg-error",
};
export { buttonText, bannerStyle };
