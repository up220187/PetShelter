import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const CheckCircleIcon: React.FC<IconProps> = ({
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
        d="M41.25 20.775V22.5C41.2477 26.5433 39.9384 30.4775 37.5175 33.7159C35.0965 36.9543 31.6936 39.3234 27.8163 40.4698C23.9389 41.6162 19.7948 41.4786 16.0021 40.0773C12.2094 38.6761 8.97121 36.0864 6.77054 32.6945C4.56986 29.3026 3.52459 25.2901 3.79063 21.2556C4.05666 17.221 5.61975 13.3806 8.24676 10.307C10.8738 7.2334 14.424 5.09133 18.3678 4.20026C22.3117 3.3092 26.438 3.71687 30.1312 5.36249M41.25 7.49999L22.5 26.2687L16.875 20.6437"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckCircleIcon;
