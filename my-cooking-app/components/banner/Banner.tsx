import { CloseIcon } from "../../assets/CloseIcon";
import { type BannerProps } from "./Banner.types";
import { buttonText, bannerStyle } from "./Banner.const";

export const Banner = ({
  variant,
  bannerType,
  title,
  description,
  onCloseBanner,
  onPrimaryActionClick,
}: BannerProps) => {
  return (
    <div
      className={`relative flex h-auto w-full flex-col items-start justify-start rounded-md border px-3 py-2.5 shadow-md backdrop-blur-[32px] ${bannerStyle[bannerType]}`}
    >
      <p className="align-middle text-[14px] leading-[140%] font-bold text-primary-text">
        {title}
      </p>
      <p className="w-11/12 align-middle text-[14px] leading-[140%] font-medium text-primary-text">
        {description}
      </p>
      {variant === "buttons" ? (
        <p className="flex w-full justify-end gap-6 pt-4 text-right align-middle text-[14px] leading-[140%] font-bold text-primary-text underline decoration-solid decoration-1">
          <button
            onClick={onPrimaryActionClick}
            className="cursor-pointer uppercase"
          >
            {buttonText[bannerType]}
          </button>
          <button onClick={onCloseBanner} className="cursor-pointer uppercase">
            Dismiss
          </button>
        </p>
      ) : (
        onCloseBanner && (
          <button
            onClick={onCloseBanner}
            className="absolute top-1 right-1 flex cursor-pointer items-center justify-center"
          >
            <CloseIcon className="h-6 w-6 shrink-0 text-primary-text" />
          </button>
        )
      )}
    </div>
  );
};
