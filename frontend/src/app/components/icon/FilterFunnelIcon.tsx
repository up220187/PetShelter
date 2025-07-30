import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const FilterFunnelIcon: React.FC<IconProps> = ({
  width = 92,
  height = 92,
  stroke = '#1E1E1E',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 92 92"
      fill="none"
      {...props}
    >
      <path
        d="M84.3334 11.5H7.66675L38.3334 47.7633V72.8333L53.6667 80.5V47.7633L84.3334 11.5Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FilterFunnelIcon;
