import "./Profile.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import img from "../../assets/img/empty-user.png";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { RootState, updatePageNavigation } from "../../Features/Features";

import { MdEdit } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.darkMode);

  useEffect(() => {
    dispatch(updatePageNavigation("profile"));
  }, [dispatch]);

  const fn_selectImage = () => {
    document.getElementById("image-select-input")?.click();
  };
  return (
    <div className="profile flex-1">
      <PagesHeader title="Profile" nav={"Profile"} subnav={""} />
      <div className={"portion rounded m-5 p-5 flex flex-col gap-3"}>
        <p
          className={`text-[16px] font-[600] ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
        >
          Change Your Profile Information
        </p>
        <div className="flex">
          <div className="flex-1 flex flex-col gap-3">
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Name
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Email
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Phone Number
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
              />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center flex-col relative">
            <img src={img} className="h-[150px] w-[150px] shadow rounded-full" />
            <MdEdit className="bg-gray-400 p-2 text-[35px] rounded-full absolute bottom-6 ml-[100px] cursor-pointer" onClick={() => fn_selectImage()} />
            <input type="file" id="image-select-input" className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
