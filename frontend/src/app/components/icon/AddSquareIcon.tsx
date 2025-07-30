import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const AddSquareIcon: React.FC<IconProps> = ({
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
        d="M22.5 15V30M15 22.5H30M9.375 5.625H35.625C37.6961 5.625 39.375 7.30393 39.375 9.375V35.625C39.375 37.6961 37.6961 39.375 35.625 39.375H9.375C7.30393 39.375 5.625 37.6961 5.625 35.625V9.375C5.625 7.30393 7.30393 5.625 9.375 5.625Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddSquareIcon;
