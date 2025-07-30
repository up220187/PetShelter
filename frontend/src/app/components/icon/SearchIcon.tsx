import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const SearchIcon: React.FC<IconProps> = ({
  width = 107,
  height = 107,
  stroke = '#1E1E1E',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 107 107"
      fill="none"
      {...props}
    >
      <path
        d="M93.625 93.625L74.2313 74.2313M84.7083 49.0417C84.7083 68.7398 68.7398 84.7083 49.0417 84.7083C29.3435 84.7083 13.375 68.7398 13.375 49.0417C13.375 29.3435 29.3435 13.375 49.0417 13.375C68.7398 13.375 84.7083 29.3435 84.7083 49.0417Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
