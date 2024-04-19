import "./Profile.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

import img from "../../assets/img/empty-user.png";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { RootState, updatePageNavigation } from "../../Features/Features";

import { MdEdit } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.darkMode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState<any>(() => {
    const storedData = localStorage.getItem("agent");
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    dispatch(updatePageNavigation("profile"));
  }, [dispatch]);

  const fn_selectImage = () => {
    document.getElementById("image-select-input")?.click();
  };

  const selectedImg = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const Formik = useFormik({
    initialValues: {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      city: data?.city,
      zipCode: data?.zipCode,
      address: data?.address,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
        <div className="flex flex-col-reverse sm:flex-row">
          {/* field-box */}
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
                className={`input capitalize ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                name="name"
                value={Formik.values.name}
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
                name="email"
                value={Formik.values.email}
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
                name="phone"
                value={Formik.values.phone}
              />
            </div>
          </div>
          {/* image-box */}
          <div className="flex-1 flex items-center justify-center flex-col relative">
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                className="h-[150px] w-[150px] shadow rounded-full"
                alt="Selected"
              />
            ) : (
              <img
                src={img}
                className="h-[150px] w-[150px] shadow rounded-full"
              />
            )}
            <MdEdit
              className="bg-gray-400 p-2 text-[35px] rounded-full absolute bottom-6 ml-[100px] cursor-pointer"
              onClick={() => fn_selectImage()}
            />
            <input
              type="file"
              id="image-select-input"
              className="hidden"
              onChange={(e) => selectedImg(e)}
            />
          </div>
        </div>
        <div className="flex">
          {/* field-box */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                City
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                name="city"
                value={Formik.values.city}
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Zip Code
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                name="zipCode"
                value={Formik.values.zipCode}
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Address
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                name="address"
                value={Formik.values.address}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
