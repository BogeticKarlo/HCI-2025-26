import { SVGProps } from "react";

export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="800"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10 14L3 7.5L10 1" stroke="currentColor" strokeLinecap="square" />
  </svg>
);
