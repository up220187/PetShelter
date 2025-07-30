import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FF8C42] w-full py-8 mt-16">
      <div className="flex justify-center items-center text-[#261C14] text-base font-medium">
        <p>Copyright © {currentYear} All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
