import "./ForSale.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Divider, Space, Input, Button } from "antd";
import ImageUploading from "react-images-uploading";

import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { RootState, updatePageNavigation } from "../../Features/Features";

import { IoMdImages } from "react-icons/io";
import { RiImageEditFill, RiVideoUploadFill } from "react-icons/ri";
import { LuImageOff } from "react-icons/lu";
import toast from "react-hot-toast";
import { homeForSaleApi } from "../../Api/api";
import { useNavigate } from "react-router-dom";

const KEY_FEATURES = [
  "In-Unit Dryer",
  "In-Unit Washer",
  "Dishwasher",
  "Dryer",
  "Microwave Oven",
];

const SERVICES = [
  "Package Service",
  "Internet Service",
  "Designer Cabinetry",
  "Quartz Countertops",
];

const CreateForSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.darkMode);

  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const filteredKeyFeatures = KEY_FEATURES.filter(
    (o) => !keyFeatures.includes(o)
  );
  const fn_addFeatures = () => {
    const inputElement = document.getElementById(
      "keyFeaturesAdd"
    ) as HTMLInputElement | null;
    if (inputElement) {
      const inputValue = inputElement.value.trim();
      if (inputValue !== "") {
        setKeyFeatures([...keyFeatures, inputValue]);
        inputElement.value = "";
      }
    }
  };
  const [services, setServices] = useState<string[]>([]);
  const filteredServices = SERVICES.filter((o) => !services.includes(o));
  const fn_addServices = () => {
    const inputElement = document.getElementById(
      "servicesAdd"
    ) as HTMLInputElement | null;
    if (inputElement) {
      const inputValue = inputElement.value.trim();
      if (inputValue !== "") {
        setServices([...services, inputValue]);
        inputElement.value = "";
      }
    }
  };
  const [selectedVideo, setSelectedVideo] = useState([]);
  const fileInputRef: any = useRef(null);
  const [property, setProperty] = useState("house");
  const [petFees, setPetFees] = useState("no");
  const [sizeSqft, setSizeSqft] = useState<number>(0);
  const [sizeAcre, setSizeAcre] = useState<number>(0);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const maxNumber = 69;
  const [section1Data, setSection1Data] = useState<{ [key: string]: any }>({});
  const [section2Data, setSection2Data] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    dispatch(updatePageNavigation("forSale"));
  }, [dispatch]);
  const fn_buildingSize = (sizeInSqft: number) => {
    if (isNaN(sizeInSqft)) {
      setSizeSqft(0);
      setSizeAcre(0);
    } else {
      setSizeSqft(sizeInSqft);
      const acreage = sizeInSqft / 43560;
      setSizeAcre(parseFloat(acreage.toFixed(2)));
    }
  };
  const fn_imageController = (imageList: any) => {
    const a = imageList.map((item: any) => item.file);
    setImages(imageList);
    setSelectedImages(a);
  };
  const handleDivClick = () => {
    fileInputRef.current.click();
    return;
  };
  const fn_selectVideo = (e: any) => {
    const file = e.target.files;
    setSelectedVideo(file);
  };
  const handleRemoveVideo = () => {
    setSelectedVideo([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
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
  const fn_Submit = async () => {
    if (property === "appartment") {
      delete section1Data?.lotSqft;
      delete section1Data?.buildingSize;
      setSection1Data({ ...section1Data, sizeSqft, sizeAcre });
    }else{
      delete section1Data?.sizeSqft;
      delete section1Data?.sizeAcre;
    }
    if(petFees === "no"){
      delete section1Data?.petFees
    }
    if (petFees === "no") {
      if(Object.keys(section1Data)?.length !== 7){
        return toast.error("Fill all Fields")
      }
    }else{
      if(Object.keys(section1Data)?.length !== 8){
        return toast.error("Fill all Fields")
      }
    }
    if(selectedImages?.length === 0){
      return toast.error("Select Images")
    }
    if(selectedVideo?.length === 0){
      return toast.error("Select Video")
    }
    if(Object.keys(section2Data).length !== 1){
      return toast.error("Fill all Fields")
    }
    if(keyFeatures?.length === 0 || services?.length === 0){
      return toast.error("Fill all Fields")
    }
    const data: any = { ...section1Data, ...section2Data, keyFeatures: keyFeatures, services: services };
    const formData = new FormData();
    formData.append('property', property);
    formData.append('address', data?.address);
    formData.append('bathrooms', data?.bathrooms);
    formData.append('bedrooms', data?.bedrooms);
    formData.append('salePrice', data?.monthlyPrice);
    formData.append('overview', data?.overview);
    formData.append('services', data?.services);
    formData.append('title', data?.title);
    formData.append('keyFeatures', data?.keyFeatures);
    if(property === "house"){
      formData.append('lotSqft', data?.lotSqft);
      formData.append('buildingSize', data?.buildingSize);
    }
    if(property === "appartment"){
      formData.append('sizeSqft', data?.sizeSqft);
      formData.append('sizeAcre', data?.sizeAcre);
    }
    if(petFees === "yes"){
      formData.append('petFees', data?.petFees);
    }
    if(selectedImages){
      for(let i = 0; i < selectedImages.length; i++){
        formData.append('images', selectedImages[i])
      }
    }
    if(selectedVideo?.length > 0){
      for(let i = 0; i < selectedVideo.length; i++){
        formData.append('video', selectedVideo[i])
      }
    }
    const result: any = await homeForSaleApi(formData);
    if(result?.status === 200){
      navigate("/sell-homes");
      return toast.success("Sale Home Added Successfully!");
    }else if(result?.response?.status === 400){
      return toast.error(result?.response?.data?.message);
    }else{
      return toast.error("Network Error");
    }
  };
  return (
    <div className="for-sale flex-1">
      <PagesHeader
        title="Request for Sale Home"
        nav={"Home For Sale"}
        subnav={"Create"}
      />
      <p className="m-5 font-[600] text-[grey] text-[13px]">
        Fill Form for Sell a Home
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
            Property Title
          </label>
          <div className="flex gap-10 items-center">
            <div className="flex">
              <input
                value={"house"}
                defaultChecked
                id="house"
                type="radio"
                name="property"
                onChange={() => setProperty("house")}
              />
              &nbsp;
              <label
                htmlFor="house"
                className={`${darkMode && "text-[var(--text-color-dark)]"}`}
              >
                House
              </label>
            </div>
            <div className="flex">
              <input
                value={"appartment"}
                id="appartment"
                type="radio"
                name="property"
                onChange={() => setProperty("appartment")}
              />
              &nbsp;
              <label
                htmlFor="appartment"
                className={`${darkMode && "text-[var(--text-color-dark)]"}`}
              >
                Appartment
              </label>
            </div>
            <div className="flex">
              <input
                value={"condo"}
                id="condo"
                type="radio"
                name="property"
                onChange={() => setProperty("condo")}
              />
              &nbsp;
              <label
                htmlFor="condo"
                className={`${darkMode && "text-[var(--text-color-dark)]"}`}
              >
                Condo
              </label>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Title
          </label>
          <input
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionOneData("title", e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row gap-2 md:gap-5">
          <div className="flex-1 flex flex-col gap-2 ">
            <label
              className={`text-[13px] font-[500] ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}
            >
              No. of BedRooms
            </label>
            <select
              className={`input ${
                darkMode
                  ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                  : "bg-[#ffffff80]"
              }`}
              onChange={(e) => fn_sectionOneData("bedrooms", e.target.value)}
            >
              <option selected value={""} className="text-black">
                ---Select---
              </option>
              <option value={"1"} className="text-black">
                1
              </option>
              <option value={"2"} className="text-black">
                2
              </option>
              <option value={"3"} className="text-black">
                3
              </option>
              <option value={"4"} className="text-black">
                4
              </option>
              <option value={"5"} className="text-black">
                5
              </option>
              <option value={"6"} className="text-black">
                6
              </option>
              <option value={"7"} className="text-black">
                7
              </option>
              <option value={"8"} className="text-black">
                8
              </option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2 ">
            <label
              className={`text-[13px] font-[500] ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}
            >
              No. of Bathrooms
            </label>
            <input
              placeholder="5 or 5 + 1/2"
              className={`input ${
                darkMode
                  ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                  : "bg-[#ffffff80]"
              }`}
              onChange={(e) => fn_sectionOneData("bathrooms", e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Sale Price ($)
          </label>
          <input
            type="number"
            className={`input ${
              darkMode
                ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                : "bg-[#ffffff80]"
            }`}
            onChange={(e) => fn_sectionOneData("salePrice", e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Is Pet Fees ?
          </label>
          <div className="flex gap-10 items-center">
            <div className="flex">
              <input
                value={"no"}
                defaultChecked
                id="petFeeNo"
                type="radio"
                name="petFee"
                onChange={() => setPetFees("no")}
              />
              &nbsp;<label htmlFor="petFeeNo">No</label>
            </div>
            <div className="flex">
              <input
                value={"yes"}
                id="petFeeYes"
                type="radio"
                name="petFee"
                onChange={() => setPetFees("yes")}
              />
              &nbsp;<label htmlFor="petFeeYes">Yes</label>
            </div>
          </div>
        </div>
        {petFees === "yes" && (
          <div className="w-full flex flex-col gap-2">
            <label
              className={`text-[13px] font-[500] ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}
            >
              Pet Fees ($)
            </label>
            <input
              type="number"
              className={`input ${
                darkMode
                  ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                  : "bg-[#ffffff80]"
              }`}
              onChange={(e) => fn_sectionOneData("petFees", e.target.value)}
            />
          </div>
        )}
        {property === "appartment" ? (
          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-5">
            <div className="flex-1 flex flex-col gap-2 ">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Sqft.
              </label>
              <input
                type="number"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                onChange={(e) => fn_buildingSize(parseInt(e.target.value))}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 ">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Acre
              </label>
              <input
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                disabled
                value={sizeAcre}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-5">
            <div className="flex-1 flex flex-col gap-2 ">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Lot Sqft.
              </label>
              <input
                type="number"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                onChange={(e) => fn_sectionOneData("lotSqft", e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 ">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Building Size
              </label>
              <input
                type="number"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                onChange={(e) =>
                  fn_sectionOneData("buildingSize", e.target.value)
                }
              />
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Images (.png / .jpg){" "}
            <span className="text-[10px] ms-5">
              *can select multiple images
            </span>
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
                    className={`font-[600] text-[13px] flex gap-2 ${
                      darkMode && "text-[var(--text-color-dark)]"
                    } mb-3`}
                  >
                    <IoMdImages className="text-[20px]" />
                    Click to Select Images
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image["data_url"]} alt="" width="100" />
                      <div className="image-item__btn-wrapper flex gap-5 mt-1 mb-2">
                        <button
                          onClick={() => onImageUpdate(index)}
                          className={"text-[13px] font-[600] flex gap-1"}
                        >
                          <RiImageEditFill className="text-[18px]" />
                          Update
                        </button>
                        <button
                          onClick={() => onImageRemove(index)}
                          className={"text-[13px] font-[600] flex gap-1"}
                        >
                          <LuImageOff className="text-[17px]" />
                          Remove
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
            Upload Video (.mkv / .mp4){" "}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            name="video"
            className="hidden"
            onChange={(e) => fn_selectVideo(e)}
          />
          {selectedVideo?.length === 0 ? (
            <div
              className="flex justify-center items-center h-[100px] border rounded border-[var(--border-color)] cursor-pointer"
              onClick={handleDivClick}
            >
              <p
                className={`font-[500] text-[13px] flex items-center gap-2 ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                <RiVideoUploadFill className="text-[20px]" />
                Click to Upload a Video
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center border rounded border-[var(--border-color)] cursor-pointer">
              <p
                className={`font-[500] text-[13px] flex items-center gap-2 ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                <video
                  src={URL.createObjectURL(selectedVideo?.[0])}
                  controls
                  width={"300px"}
                />
              </p>
              <button
                className="text-[13px] font-[500] my-3"
                onClick={handleRemoveVideo}
              >
                Remove / Change Video
              </button>
            </div>
          )}
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
          <Select
            mode="multiple"
            placeholder="Key Features"
            value={keyFeatures}
            onChange={setKeyFeatures}
            style={{ width: "100%" }}
            options={filteredKeyFeatures.map((item) => ({
              value: item,
              label: item,
            }))}
            className={`${!darkMode ? "custom-select" : "custom-select-dark"}`}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Enter More Features"
                    id="keyFeaturesAdd"
                    onKeyDown={(e) => e.stopPropagation()}
                    onPressEnter={fn_addFeatures}
                  />
                  <Button
                    type="text"
                    onClick={fn_addFeatures}
                    className="bg-[var(--sidebar-color)] text-white font-[500]"
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`text-[13px] font-[500] ${
              darkMode && "text-[var(--text-color-dark)]"
            }`}
          >
            Services & Facilities
          </label>
          <Select
            mode="multiple"
            placeholder="Services"
            value={services}
            onChange={setServices}
            style={{ width: "100%" }}
            options={filteredServices.map((item) => ({
              value: item,
              label: item,
            }))}
            className={`${!darkMode ? "custom-select" : "custom-select-dark"}`}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Enter More Services"
                    id="servicesAdd"
                    onKeyDown={(e) => e.stopPropagation()}
                    onPressEnter={fn_addServices}
                  />
                  <Button
                    type="text"
                    onClick={fn_addServices}
                    className="bg-[var(--sidebar-color)] text-white font-[500]"
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          />
        </div>
      </div>
      {/* button */}
      <button
        className={`mx-5 mb-5 submit-button ${
          darkMode ? "text-[var(--text-color-dark)]" : "text-white"
        }`}
        onClick={fn_Submit}
      >
        Submit for Approval
      </button>
    </div>
  );
};

export default CreateForSale;
