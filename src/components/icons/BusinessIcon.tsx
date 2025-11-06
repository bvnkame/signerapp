import React from "react";

const BusinessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Office building */}
    <rect x="3" y="7" width="7" height="13" rx="1" />
    <rect x="14" y="3" width="7" height="17" rx="1" />
    {/* Windows */}
    <path d="M5 10h1M5 13h1M5 16h1M16 6h1M16 9h1M16 12h1M16 15h1" />
    {/* Door */}
    <path d="M8 18v2M17 18v2" />
  </svg>
);

export default BusinessIcon;