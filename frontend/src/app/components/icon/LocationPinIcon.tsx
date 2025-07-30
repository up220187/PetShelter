import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const LocationPinIcon: React.FC<IconProps> = ({
  width = 45,
  height = 45,
  stroke = '#1E1E1E',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 45 45"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M39.375 18.75C39.375 31.875 22.5 43.125 22.5 43.125C22.5 43.125 5.625 31.875 5.625 18.75C5.625 14.2745 7.4029 9.98225 10.5676 6.81757C13.7322 3.6529 18.0245 1.875 22.5 1.875C26.9755 1.875 31.2677 3.6529 34.4324 6.81757C37.5971 9.98225 39.375 14.2745 39.375 18.75Z"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.5 24.375C25.6066 24.375 28.125 21.8566 28.125 18.75C28.125 15.6434 25.6066 13.125 22.5 13.125C19.3934 13.125 16.875 15.6434 16.875 18.75C16.875 21.8566 19.3934 24.375 22.5 24.375Z"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="45" height="45" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LocationPinIcon;
