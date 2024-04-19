import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState, updateLogin, updateSidebar } from "../../Features/Features";

import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { TbHomeStats, TbHomeDollar } from "react-icons/tb";
import { MdMessage } from "react-icons/md";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showSidebar = useSelector((state: RootState) => state.showSideBar);
  const pageNavigate = useSelector((state: RootState) => state.pageNavigate);
  const [properties, setProterties] = useState(false);
  const fn_controlSidebar = () => {
    dispatch(updateSidebar(false));
  };
  interface fn_navigationToProps {
    nav: string;
  }
  const fn_navigationTo = (props: fn_navigationToProps): void => {
    navigate(props.nav);
  };
  const fn_showSubMenus = () => {
    setProterties(!properties);
  }
  const fn_logout = () => {
    dispatch(updateLogin(false));
    navigate("/sign-in");
    localStorage.removeItem("agent");
  };
  return (
    <>
      <div
        className={`${
          !showSidebar && "hidden"
        } fixed lg:fixed lg:block w-[250px] bg-[var(--sidebar-color)] text-white h-screen z-[999]`}
      >
        <div className="relative h-[70px] border-b border-[var(--border-color)] flex items-center px-5">
          <p
            className="absolute end-5 w-[30px] h-[30px] flex lg:hidden items-center justify-center rounded cursor-pointer text-[--border-color]"
            onClick={fn_controlSidebar}
          >
            <FaArrowLeft />
          </p>
          <p className="absolute">Logo</p>
        </div>
        <div className="p-5 border-b border-[var(--border-color)]">
          <p className="text-[var(--border-color)] font-[600] text-[17px] mb-5 ps-2">
            Menus
          </p>
          <ul className="flex gap-2 flex-col">
            {/* Dashboard */}
            <li
              className={`${
                pageNavigate === "dashboard" && "bg-[var(--border-color)]"
              } cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={() => fn_navigationTo({ nav: "/" })}
            >
              <BiSolidDashboard />
              Dashboard
            </li>
            {/* Properties */}
            <li
              className={`${
                (pageNavigate === "forRent" || pageNavigate === "forSale") && "bg-[var(--border-color)]"
              } cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={() => fn_showSubMenus()}
            >
              <FaHome className="scale-[1.2]" />
              Properties
              <IoIosArrowDown className="ms-[55px]" />
            </li>
            {/* Properties sub-menu */}
            {properties && (
              <>
                <li
                  className={`${
                    pageNavigate === "forRent" && "bg-[var(--border-color)]"
                  } cursor-pointer py-1 px-2 ms-5 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[14px]`}
                  onClick={() => fn_navigationTo({ nav: "/rental-homes" })}
                >
                  <TbHomeStats className="scale-[1.3]" />
                  Home For Rent
                </li>
                <li
                  className={`${
                    pageNavigate === "forSale" && "bg-[var(--border-color)]"
                  } cursor-pointer py-1 px-2 ms-5 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[14px]`}
                  onClick={() => fn_navigationTo({ nav: "/sell-homes" })}
                >
                  <TbHomeDollar className="scale-[1.3]" />
                  Home For Sale
                </li>
              </>
            )}
            {/* Contacts */}
            <li
              className={`${
                pageNavigate === "contact" && "bg-[var(--border-color)]"
              } cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={() => fn_navigationTo({ nav: "/contacts" })}
            >
              <MdMessage className="scale-[1.2]" />
              Contacts
            </li>
            {/* Setting */}
            <li
              className={`${
                pageNavigate === "setting" && "bg-[var(--border-color)]"
              } cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={() => fn_navigationTo({ nav: "/setting" })}
            >
              <IoSettingsSharp className="scale-[1.2]" />
              Setting
            </li>
          </ul>
        </div>
        <div className="p-5 border-b border-[var(--border-color)]">
          <p className="text-[var(--border-color)] font-[600] text-[17px] mb-5 ps-2">
            Profile
          </p>
          <ul className="flex gap-2 flex-col">
            <li
              className={`${
                pageNavigate === "profile" && "bg-[var(--border-color)]"
              } cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={() => fn_navigationTo({ nav: "/profile" })}
            >
              <FaUser />
              Profile
            </li>
            <li
              className={`cursor-pointer p-2 rounded-[8px] hover:bg-[var(--border-color)] flex items-center gap-4 text-[15px]`}
              onClick={fn_logout}
            >
              <CgLogOut className="scale-[1.2]" />
              Log out
            </li>
          </ul>
        </div>
      </div>
      <div className="hidden lg:block w-[250px]"></div>
    </>
  );
};

export default Sidebar;
