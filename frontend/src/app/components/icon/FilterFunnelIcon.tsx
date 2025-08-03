import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const FilterFunnelIcon: React.FC<IconProps> = ({
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
      <path
        d="M6.5625 9.375H38.4375L26.25 23.4375V34.6875L18.75 39.375V23.4375L6.5625 9.375Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FilterFunnelIcon;
