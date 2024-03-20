import "./ForRent.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUploading from "react-images-uploading";

import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { RootState, updatePageNavigation } from "../../Features/Features";
import { getRentalHomebyId, homeForRentApi } from "../../Api/api";

import { IoMdImages } from "react-icons/io";
import { RiImageEditFill } from "react-icons/ri";
import { LuImageOff } from "react-icons/lu";

const EditForRent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.darkMode);
  const [data, setData] = useState({});
  const [images, setImages] = useState([]); 
  const [selectedImages, setSelectedImages] = useState([]);
  const maxNumber = 20;
  const [nearbySchoolNumber, setNearbySchoolNumber] = useState(1);
  const [section1Data, setSection1Data] = useState<{ [key: string]: string }>({});
  const [section2Data, setSection2Data] = useState<{ [key: string]: string }>({});
  const [section3Data, setSection3Data] = useState<{ [key: string]: string }>({});
  const [section4Data, setSection4Data] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const fetchData = async() => {
        const result: any = await getRentalHomebyId(id);
        if(result?.status === 200){
            setData(result?.data?.message);
            setSection1Data({
              ...section1Data,
              name: result?.data?.message?.name,
              price: result?.data?.message?.price,
              size: result?.data?.message?.size,
              images: result?.data?.message?.images,
              address: result?.data?.message?.address,
            });
            setSection2Data({
              ...section2Data,
              overview: result?.data?.message?.overview
            });
            setSection3Data({
              ...section3Data,
              keyFeatures: result?.data?.message?.keyFeatures,
              services: result?.data?.message?.services,
              appliances: result?.data?.message?.appliances,
              specialFeatures: result?.data?.message?.specialFeatures,
              rentalCost: result?.data?.message?.rentalCost,
            });
            setSection4Data({
              ...section4Data,
              nearbySchool: result?.data?.message?.nearbySchool,
            });
        }
    }
    fetchData();
  }, []);
  useEffect(() => {
    dispatch(updatePageNavigation("forRent"));
  }, [dispatch]);
  const fn_imageController = (imageList: any) => {
    const a = imageList.map((item: any) => item.file);
    setImages(imageList);
    setSelectedImages(a);
  };
  const fn_controlNearbySchoolNumber = (clicked: any) => {
    if (clicked === "add") {
      setNearbySchoolNumber(nearbySchoolNumber + 1);
    } else {
      if (nearbySchoolNumber === 1) return;
      setNearbySchoolNumber(nearbySchoolNumber - 1);
    }
  };
  const fn_sectionOneData = (property: string, value: any) => {
    let updatedData = { ...section1Data };
    if (value === "") {
      delete updatedData[property];
      setSection1Data(updatedData);
    } else {
      setSection1Data({ ...section1Data, [property]: value });
    }
  };
  const fn_sectionTwoData = (property: string, value: any) => {
    let updatedData = { ...section2Data };
    if (value === "") {
      delete updatedData[property];
      setSection2Data(updatedData);
    } else {
      setSection2Data({ ...section2Data, [property]: value });
    }
  };
  const fn_sectionThreeData = (property: string, value: any) => {
    let updatedData = { ...section3Data };
    if (value === "") {
      delete updatedData[property];
      setSection3Data(updatedData);
    } else {
      setSection3Data({ ...section3Data, [property]: value });
    }
  };
  const fn_sectionFourData = (property: string, value: any, index: any) => {
    if (property === "nearbySchool") {
      const schoolArray = section4Data?.nearbySchool
        ? section4Data?.nearbySchool
        : [];
      const schoolObj = value;
      //@ts-ignore
      schoolArray[index] = schoolObj;
      //@ts-ignore
      setSection4Data({ ...section4Data, nearbySchool: schoolArray });
    }
  };
  const fn_Submit = async () => {
    if (
      Object.keys(section1Data).length !== 4 ||
      Object.keys(section2Data).length !== 1 ||
      Object.keys(section3Data).length !== 5 ||
      Object.keys(section4Data).length !== 1
    ) {
      return toast.error("Fill all Fields");
    }
    const data = {
      ...section1Data,
      ...section2Data,
      ...section3Data,
      ...section4Data,
    };
    const params = new FormData();
    //@ts-ignore
    params.append("agent", JSON.parse(localStorage.getItem('agent'))._id);
    params.append("address", data?.address);
    params.append("appliances", data?.appliances);
    //@ts-ignore
    params.append('images', images);
    params.append("keyFeatures", data?.keyFeatures);
    params.append("name", data?.name);
    params.append("nearbySchool", JSON.stringify(data?.nearbySchool));
    params.append("overview", data?.overview);
    params.append("price", data?.price);
    params.append("rentalCost", data?.rentalCost);
    params.append("services", data?.services);
    params.append("size", data?.size);
    params.append("specialFeatures", data?.specialFeatures);
    const result = await homeForRentApi(params);
    //@ts-ignore
    if(result?.status === 200){
      navigate("/rental-homes/get");
      return toast.success("Rental Home Added Successfully");
      //@ts-ignore
    }else if(result?.response?.status === 400){
      //@ts-ignore
      return toast.error(result?.response?.data?.message);
    }else{
      return toast.error("Network Error");
    }
  };
  console.log(section4Data);
  return (
    <div className="for-rent flex-1">
      <PagesHeader title="Edit Request for Rental Home" nav={"Home For Rent"} />
      <p className="m-5 font-[600] text-[grey] text-[13px]">
        Edit Form for Rent a Home
      </p>
      {/* section-1 */}
      <div className={"portion rounded m-5 p-5 flex flex-col gap-5"}>
        <p
          className={`text-[16px] font-[600] ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
        >
          Units
        </p>
        <div className="w-full flex flex-col gap-2">
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
            onChange={(e) => fn_sectionOneData("name", e.target.value)}
            value={section1Data?.name}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Price ($)
          </label>
          <input
            type="number"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionOneData("price", e.target.value)}
            value={section1Data?.price}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Building Size (sqft)
          </label>
          <input
            type="number"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionOneData("size", e.target.value)}
            value={section1Data?.size}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Images (png / jpg)
          </label>
          <div>
            <ImageUploading
              multiple
              value={images}
              onChange={fn_imageController}
              maxNumber={maxNumber}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <div className="upload__image-wrapper">
                  <button
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                    className={`font-[600] text-[13px] flex gap-2 ${darkMode && "text-[var(--text-color-dark)]"} mb-3`}
                  >
                    <IoMdImages className="text-[20px]" />Click to Select Images
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image["data_url"]} alt="" width="100" />
                      <div className="image-item__btn-wrapper flex gap-5 mt-1 mb-2">
                        <button onClick={() => onImageUpdate(index)} className={"text-[13px] font-[600] flex gap-1"}>
                          <RiImageEditFill className="text-[18px]" />Update
                        </button>
                        <button onClick={() => onImageRemove(index)} className={"text-[13px] font-[600] flex gap-1"}>
                          <LuImageOff className="text-[17px]" />Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
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
            onChange={(e) => fn_sectionOneData("address", e.target.value)}
            value={section1Data?.address}
          />
        </div>
      </div>
      {/* section-2 */}
      <div className={"portion rounded m-5 p-5 flex flex-col gap-5"}>
        <p
          className={`text-[16px] font-[600] ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
        >
          Overview
        </p>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Detailed Overview
          </label>
          <textarea
            className={`input h-[120px] ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionTwoData("overview", e.target.value)}
            value={section2Data?.overview}
          />
        </div>
      </div>
      {/* section-3 */}
      <div className={"portion rounded m-5 p-5 flex flex-col gap-5"}>
        <p
          className={`text-[16px] font-[600] ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
        >
          Facts and features / Building amenities
        </p>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Key features
          </label>
          <input
            placeholder="example: In-unit dryer, in-unit washer"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionThreeData("keyFeatures", e.target.value)}
            value={section3Data?.keyFeatures}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Services & facilities
          </label>
          <input
            placeholder="example: Package service, Internet Service"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionThreeData("services", e.target.value)}
            value={section3Data?.services}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Appliances
          </label>
          <input
            placeholder="example: Dishwasher, Dryer, Microwave oven"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionThreeData("appliances", e.target.value)}
            value={section3Data?.appliances}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Special Features
          </label>
          <input
            placeholder="example: Designer Cabinetry, Quartz Countertops"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) =>
              fn_sectionThreeData("specialFeatures", e.target.value)
            }
            value={section3Data?.specialFeatures}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Rental Costs and Fees ($)
          </label>
          <input
            type="number"
            placeholder="Rent for 1 Bed"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionThreeData("rentalCost", e.target.value)}
            value={section3Data?.rentalCost}
          />
        </div>
      </div>
      {/* section-4 */}
      <div className={"portion rounded m-5 p-5 flex flex-col gap-5"}>
        <p
          className={`text-[16px] font-[600] ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
        >
          Nearby Areas
        </p>
        {/* @ts-ignore */}
        {section4Data?.nearbySchool?.map((item, index) => (
          <div className="w-full flex flex-col gap-2" key={index}>
            <label
              className={`text-[13px] font-[500] flex justify-between ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}
            >
              <span>Nearby School</span>
              <span
                className={`text-[10px] underline cursor-pointer font-[400] mt-[-10px] ${
                  darkMode ? "text-red-400" : "text-[red]"
                }`}
                onClick={() => fn_controlNearbySchoolNumber("delete")}
              >
                Delete Entry
              </span>
            </label>
            <input
              placeholder="example: Jotham W. Wakeman No. 6 Elementary School"
              className={`input ${
                darkMode
                  ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                  : "bg-[#ffffff80]"
              }`}
              onChange={(e) =>
                fn_sectionFourData("nearbySchool", e.target.value, index)
              }
              value={item}
            />
          </div>
        ))}
        <p
          className={`text-[10px] underline cursor-pointer mt-[-10px] ${
            darkMode ? "text-red-400" : "text-[red]"
          }`}
          onClick={() => fn_controlNearbySchoolNumber("add")}
        >
          Add more...
        </p>
      </div>
      {/* button */}
      <button
        className={`mx-5 mb-5 submit-button ${
          darkMode ? "text-[var(--text-color-dark)]" : "text-white"
        }`}
        onClick={fn_Submit}
      >
        Submit Changes
      </button>
    </div>
  );
};

export default EditForRent;
