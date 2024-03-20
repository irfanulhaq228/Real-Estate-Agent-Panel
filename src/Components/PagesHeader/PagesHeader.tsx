import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Features/Features';

interface PagesHeaderProps {
  title: string;
  nav: string;
  subnav: string;
}

const PagesHeader: React.FC<PagesHeaderProps> = ({ title, nav, subnav }) => {
  const darkMode = useSelector((state: RootState) => state.darkMode);
  return (
    <div className={`h-[70px] flex items-center justify-between p-5 border-b ${darkMode && "border-gray-700"}`}>
      <p className={`${darkMode && "text-gray-300"} text-[20px] font-[600]`}>{title}</p>
      <p className="hidden sm:block font-[500] cursor-pointer">
        <span className={`${darkMode && "text-gray-300"}`}>Dashboard / </span>
        <span className="text-gray-500">{nav}</span>
        {subnav && <span className="text-gray-500"> / {subnav}</span>}
      </p>
    </div>
  );
};

export default PagesHeader;
