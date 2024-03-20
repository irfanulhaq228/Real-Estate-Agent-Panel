import "./Navbar.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, updateSidebar, updateWebMode } from "../../Features/Features";

import { FaBars } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showSidebarButton, setShowSidebarButton] = useState(true);
  const darkMood = useSelector((state: RootState) => state.darkMode);

  const fn_controlSideBar = () => {
    dispatch(updateSidebar(true));
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024) {
        setShowSidebarButton(true);
      } else {
        setShowSidebarButton(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  interface fn_changeMoodProps {
    e: React.ChangeEvent<HTMLInputElement>;
  }
  const fn_changeMood = (props: fn_changeMoodProps): void => {
    const value = props.e;
    dispatch(updateWebMode(value.target.checked));
  };
  return (
    <div className={`${!darkMood ? "bg-[--navbar-color-light]" : "bg-[var(--sidebar-color)]"} h-[70px] flex items-center justify-between px-5 border-b border-[var(--border-color)]`}>
      <div>
        {showSidebarButton && (
          <button
            className="bg-[var(--sidebar-color)] text-white p-2.5 rounded-[10px]"
            onClick={fn_controlSideBar}
          >
            <FaBars />
          </button>
        )}
      </div>
      <div className="flex gap-5 items-center">
        <label className="ui-switch">
          <input type="checkbox" onChange={(e) => fn_changeMood({ e })} />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>
        <p className="bg-[--border-color] p-3 rounded-full text-[var(--sidebar-color)] cursor-pointer">
          <IoPersonSharp />
        </p>
      </div>
    </div>
  );
};

export default Navbar;
