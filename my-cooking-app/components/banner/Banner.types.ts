type BannerVariant = "simple" | "buttons";
type BannerType = "success" | "error";

type BannerProps = {
  variant: BannerVariant;
  bannerType: BannerType;
  title: string;
  description: string;
  onCloseBanner?: () => void;
  onPrimaryActionClick?: () => void;
};

export type { BannerProps, BannerType, BannerVariant };
