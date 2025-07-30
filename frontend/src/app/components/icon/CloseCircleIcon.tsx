import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const CloseCircleIcon: React.FC<IconProps> = ({
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
        d="M28.125 16.875L16.875 28.125M16.875 16.875L28.125 28.125M41.25 22.5C41.25 32.8553 32.8553 41.25 22.5 41.25C12.1447 41.25 3.75 32.8553 3.75 22.5C3.75 12.1447 12.1447 3.75 22.5 3.75C32.8553 3.75 41.25 12.1447 41.25 22.5Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseCircleIcon;
