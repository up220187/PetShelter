import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
}

const EditDocumentIcon: React.FC<IconProps> = ({
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
        d="M20.625 7.49994H7.5C6.50544 7.49994 5.55161 7.89502 4.84835 8.59829C4.14509 9.30155 3.75 10.2554 3.75 11.2499V37.4999C3.75 38.4945 4.14509 39.4483 4.84835 40.1516C5.55161 40.8548 6.50544 41.2499 7.5 41.2499H33.75C34.7446 41.2499 35.6984 40.8548 36.4017 40.1516C37.1049 39.4483 37.5 38.4945 37.5 37.4999V24.3749M34.6875 4.68744C35.4334 3.94152 36.4451 3.52246 37.5 3.52246C38.5549 3.52246 39.5666 3.94152 40.3125 4.68744C41.0584 5.43336 41.4775 6.44504 41.4775 7.49994C41.4775 8.55483 41.0584 9.56651 40.3125 10.3124L22.5 28.1249L15 29.9999L16.875 22.4999L34.6875 4.68744Z"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditDocumentIcon;
