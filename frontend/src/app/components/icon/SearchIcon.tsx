import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const SearchIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 35 35"
      fill="none"
      {...props}
    >
      <path
        d="M20.625 35.625C29.1094 35.625 35.625 29.1094 35.625 20.625C35.625 12.1406 29.1094 5.625 20.625 5.625C12.1406 5.625 5.625 12.1406 5.625 20.625C5.625 29.1094 12.1406 35.625 20.625 35.625Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.375 39.375L31.875 31.875"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
