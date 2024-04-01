import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import ImageUploading from "react-images-uploading";
import toast from "react-hot-toast";
import GoogleMapReact from 'google-map-react';

import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { RootState, updatePageNavigation } from "../../Features/Features";
import { homeForSaleApi } from "../../Api/api";

import { IoMdImages } from "react-icons/io";
import { RiImageEditFill, RiVideoUploadFill } from "react-icons/ri";
import { MdLocationPin, MdDelete } from "react-icons/md";
import { LuImageOff } from "react-icons/lu";

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
  const agentData: any = localStorage.getItem("agent");

  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const filteredKeyFeatures = KEY_FEATURES.filter(
    (o) => !keyFeatures.includes(o)
  );
  const [services, setServices] = useState<string[]>([]);
  const filteredServices = SERVICES.filter((o) => !services.includes(o));
  const [selectedVideo, setSelectedVideo] = useState([]);
  const fileInputRef: any = useRef(null);
  const [property, setProperty] = useState("house");
  const [petFees, setPetFees] = useState("no");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const maxNumber = 69;
  const [section1Data, setSection1Data] = useState<{ [key: string]: any }>({});
  const [section2Data, setSection2Data] = useState<{ [key: string]: any }>({});

  const [ center, setCenter ] = useState<{ lat: number, lng: number }>({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    dispatch(updatePageNavigation("forSale"));
  }, [dispatch]);

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
      setSection1Data({ ...section1Data });
    }
    if(petFees === "no"){
      delete section1Data?.petFees
    }
    if (petFees === "no") {
      if(property === "appartment"){
        if(Object.keys(section1Data)?.length !== 8){
          return toast.error("Fill all Fields")
        }
      }else{
        if(Object.keys(section1Data)?.length !== 9){
          return toast.error("Fill all Fields")
        }
      }
    }else{
      if(property === "appartment"){
        if(Object.keys(section1Data)?.length !== 9){
          return toast.error("Fill all Fields")
        }
      }else{
        if(Object.keys(section1Data)?.length !== 10){
          return toast.error("Fill all Fields")
        }
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
    formData.append('agent', JSON.parse(agentData)._id);
    formData.append('property', property);
    formData.append('address', data?.address);
    formData.append('bathrooms', data?.bathrooms);
    formData.append('bedrooms', data?.bedrooms);
    formData.append('salePrice', data?.salePrice);
    formData.append('overview', data?.overview);
    formData.append('services', data?.services);
    formData.append('title', data?.title);
    formData.append('keyFeatures', data?.keyFeatures);
    formData.append('fromTourDate', data?.fromTourDate);
    formData.append('toTourDate', data?.toTourDate);
    formData.append('sqft', data?.sqft);
    formData.append('nearbyAddresses', JSON.stringify(nearbyAddresses));
    formData.append('location', JSON.stringify({ type: "Point", coordinates: [center?.lng, center?.lat] }));
    if(property !== "appartment"){
      formData.append('lotSqft', data?.lotSqft);
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
      return toast.success("Sell Home Added Successfully!");
    }else if(result?.response?.status === 400){
      return toast.error(result?.response?.data?.message);
    }else{
      return toast.error("Network Error");
    }
  };
  // ====================================================================
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [markersArray, setMarkersArray] = useState([]);
  const [pyrmont, setPyrmont] = useState(null);
  //@ts-ignore
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);

  const [ searchedAddress, setSearchedAddress ] = useState("");
  const [ searchedLatitude, setSearchedLatitude ] = useState("");
  const [ searchedLongitude, setSearchedLongitude ] = useState("");
  const [nearbyAddresses, setNearbyAddresses]: any[] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const pyrmontCoords = new window.google.maps.LatLng(20.268455824834792, 85.84099235520011);
      //@ts-ignore
      setPyrmont(pyrmontCoords);
      //@ts-ignore
      setGeocoder(new window.google.maps.Geocoder());
    };

    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB7wcJO7zopVeQ8pytTS_wl6EeCHZYofOA&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.onload = initializeMap;
    document.head.appendChild(googleMapsScript);

    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
    jqueryScript.async = true;
    jqueryScript.defer = true;
    document.head.appendChild(jqueryScript);

    return () => {
      document.head.removeChild(googleMapsScript);
      document.head.removeChild(jqueryScript);
    };
  }, []);

  const initializeMap = () => {
    const pyrmontCoords = new window.google.maps.LatLng(20.268455824834792, 85.84099235520011);
    //@ts-ignore
    setPyrmont(pyrmontCoords);
    //@ts-ignore
    setGeocoder(new window.google.maps.Geocoder());
    //@ts-ignore
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      center: pyrmontCoords,
      zoom: 14
    });
    //@ts-ignore
    setMap(mapInstance);
    //@ts-ignore
    setInfowindow(new window.google.maps.InfoWindow());
    searchTypes(pyrmontCoords);
    console.log("line-237 ===> ", pyrmontCoords);
  };

  //@ts-ignore
  const searchTypes = (latLng) => {
    clearOverlays();
    if (!latLng) {
      latLng = pyrmont;
    }
    //@ts-ignore
    const type = document.querySelector('.chkbox:checked').value;
    const icon = `images/${type}.png`;

    const request = {
      location: latLng,
      radius: 20000,
      types: [type]
    };
    //@ts-ignore
    const service = new window.google.maps.places.PlacesService(map);
    //@ts-ignore
    service.search(request, (results, status) => {
      //@ts-ignore
      map.setZoom(14);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        //@ts-ignore
        results.forEach(result => {
          result.html_attributions = '';
          createMarker(result, icon);
        });
      }
    });
  };

  //@ts-ignore
  const createMarker = (place, icon) => {
    const placeLoc = place.geometry.location;
    const marker = new window.google.maps.Marker({
      //@ts-ignore
      map: map,
      position: placeLoc,
      icon: icon,
      visible: true
    });

    const newMarkersArray = [...markersArray, marker];
    //@ts-ignore
    setMarkersArray(newMarkersArray);

    window.google.maps.event.addListener(marker, 'click', () => {
      //@ts-ignore
      infowindow.setContent(`<b>Name:</b>${place.name}<br><b>Address:</b>${place.vicinity}<br><b>Reference:</b>${place.reference}<br><b>Rating:</b>${place.rating}<br><b>Id:</b>${place.id}`);
      //@ts-ignore
      infowindow.open(map, marker);
    });
  };

  const clearOverlays = () => {
    if (markersArray) {
      markersArray.forEach(marker => {
        //@ts-ignore
        marker.setVisible(false);
      });
    }
  };
  //   document.querySelectorAll(':checkbox').forEach(checkbox => checkbox.removeAttribute('checked'));
  //   //@ts-ignore
  //   document.getElementById(event.target.id).setAttribute('checked', true);
  //   //@ts-ignore
  //   searchTypes(map.getCenter());
  // };

  useEffect(() => {
    window.addEventListener('load', initializeMap);
    return () => {
      window.removeEventListener('load', initializeMap);
    };
  }, [map, markersArray, infowindow, pyrmont]);

  const handleHideMarkers = () => {
    //@ts-ignore
    document.getElementById('show_btn').style.display = 'block';
    //@ts-ignore
    document.getElementById('hide_btn').style.display = 'none';
    clearOverlays();
  };

  const handleShowMap = () => {
    const imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png';
    //@ts-ignore
    const markerImage = new window.google.maps.MarkerImage(imageUrl, new window.google.maps.Size(24, 32));
    //@ts-ignore
    const inputAddr = document.getElementById('address').value;
    //@ts-ignore
    geocoder.geocode({ address: inputAddr }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        const latlng = new window.google.maps.LatLng(latitude, longitude);
        if (results[0]) {
          //@ts-ignore
          // map.setZoom(14);
          //@ts-ignore
          // map.setCenter(latlng);
          const newMarker = new window.google.maps.Marker({
            position: latlng,
            //@ts-ignore
            map: map,
            icon: markerImage,
            draggable: true
          });
          //@ts-ignore
          setMarker(newMarker);
          //@ts-ignore
          document.getElementById('btn').style.display = 'block';
          //@ts-ignore
          document.getElementById('latitude').style.display = 'none';
          //@ts-ignore
          document.getElementById('longitude').style.display = 'none';
          //@ts-ignore
          document.getElementById('address').value = results[0].formatted_address;
          //@ts-ignore
          setSearchedAddress(results[0].formatted_address)
          //@ts-ignore
          document.getElementById('latitude').value = newMarker.getPosition().lat();
          //@ts-ignore
          setSearchedLatitude(newMarker.getPosition().lat());
          //@ts-ignore
          document.getElementById('longitude').value = newMarker.getPosition().lng();
          //@ts-ignore
          setSearchedLongitude(newMarker.getPosition().lng());
          //@ts-ignore
          infowindow.setContent(results[0].formatted_address);
          //@ts-ignore
          infowindow.open(map, newMarker);
          searchTypes(newMarker.getPosition());
          window.google.maps.event.addListener(newMarker, 'dragend', () => {
            //@ts-ignore
            geocoder.geocode({ 'latLng': newMarker.getPosition() }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              //@ts-ignore
            document.getElementById('btn').style.display = 'block';
            //@ts-ignore
            document.getElementById('latitude').style.display = 'block';
            //@ts-ignore
            document.getElementById('longitude').style.display = 'block';
            //@ts-ignore
            document.getElementById('address').value = results[0].formatted_address;
            //@ts-ignore
            document.getElementById('latitude').value = newMarker.getPosition().lat();
            //@ts-ignore
            document.getElementById('longitude').value = newMarker.getPosition().lng();
            }
            //@ts-ignore
            infowindow.setContent(results[0].formatted_address);
            const centralLatLng = newMarker.getPosition();
            searchTypes(centralLatLng);
            //@ts-ignore
            infowindow.open(map, newMarker);
            }
            });
            });
            } else {
            alert('No results found');
            }
            } else {
            alert('Geocoder failed due to: ' + status);
            }
            });
  };

  const fn_addAddress = () => {
    if(nearbyAddresses?.find((item: any) => item?.lat === searchedLatitude && item?.lon === searchedLongitude)){
      return;
    }
    const obj: { address: string; lat: string; lon: string } = {
      address: searchedAddress,
      lat: searchedLatitude,
      lon: searchedLongitude
    };
    setNearbyAddresses((prevState: { address: string; lat: string; lon: string }[]) => [...prevState, obj]);
    setMap(null);
    setInfowindow(null);
    setMarkersArray([]);
    setSearchedAddress("");
    setSearchedLatitude("");
    setSearchedLongitude("");
    const addressElement = document.getElementById("address") as HTMLInputElement;
    console.log(addressElement);
    if (addressElement) {
      addressElement.value = "";
    }
  };

  const fn_changeAddress = () => {
    setMap(null);
    setInfowindow(null);
    setMarkersArray([]);
    setSearchedAddress("");
    setSearchedLatitude("");
    setSearchedLongitude("");
    const addressElement = document.getElementById("address") as HTMLInputElement;
    console.log(addressElement);
    if (addressElement) {
      addressElement.value = "";
    }
  };

  const fn_deleteAddress = (index: any) => {
    const findIndex = nearbyAddresses.findIndex((_: any, i: any) => i === index);
    if (findIndex !== -1) {
      const updatedAddresses = nearbyAddresses.filter((_: any, i: any) => i !== findIndex);
      setNearbyAddresses(updatedAddresses);
  }
  };

  // ===========================================================

  const handleMapChange = ({ center }: {center:any}) => {
    setCenter(center);
  };

  return (
    <div className="for-rent flex-1">
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
            Property
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
            Select Tour Date
          </label>
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-1">
              <label className={`text-[12px] font-[600] ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}>From Date</label>
              <input
                type="date"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                onChange={(e) =>
                  fn_sectionOneData("fromTourDate", e.target.value)
                }
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className={`text-[12px] font-[600] ${
                darkMode && "text-[var(--text-color-dark)]"
              }`}>To Date</label>
              <input
                type="date"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                onChange={(e) =>
                  fn_sectionOneData("toTourDate", e.target.value)
                }
              />
            </div>
          </div>
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
                onChange={(e) => fn_sectionOneData("sqft", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
            <div className="flex-1 flex flex-col gap-2">
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
                onChange={(e) => fn_sectionOneData("sqft", e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Acre
              </label>
              <input
                type="number"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                value={(parseInt(section1Data?.sqft)/43560).toFixed(2)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
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
                onChange={(e) =>
                  fn_sectionOneData("lotSqft", e.target.value)
                }
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label
                className={`text-[13px] font-[500] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                Lot Acre
              </label>
              <input
                type="number"
                className={`input ${
                  darkMode
                    ? "bg-[#ffffff27] text-[var(--text-color-dark)]"
                    : "bg-[#ffffff80]"
                }`}
                value={(parseInt(section1Data?.lotSqft)/43560).toFixed(2)}
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
          {selectedVideo?.length === 0 && (
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
          )}
          {selectedVideo?.length > 0 && (
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
          <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyB7wcJO7zopVeQ8pytTS_wl6EeCHZYofOA" }}
              defaultCenter={center}
              defaultZoom={13}
              onChange={handleMapChange}
            >
              <AnyReactComponent />
            </GoogleMapReact>
          </div>
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
          />
        </div>
      </div>
      {/* section-4 */}
      <div className="portion rounded m-5 p-5 flex flex-col gap-5">
        <p className={`text-[16px] font-[600] ${darkMode && "text-[var(--text-color-dark)]"}`}>Nearby Areas</p>
        <div className={`${nearbyAddresses?.length === 0 ? "hidden" : "flex flex-col gap-2"}`}>
          {nearbyAddresses?.length > 0 && nearbyAddresses?.map((item: any, index: any) => (
            <div className={`flex justify-between items-center ${darkMode && "text-[var(--text-color-dark)]"}`}>
              <div className="flex items-center gap-2">
                <MdLocationPin className="text-[20px]" />
                <p className="text-[13px] font-[500]">{item?.address}</p>
              </div>
              <div>
                <MdDelete className="text-[20px] cursor-pointer hover:scale-[1.03]" onClick={() => fn_deleteAddress(index)} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div id="map"></div>
          {/* <button id="show_btn" onClick={handleShowMarkers}>Show Markers</button> */}
          <button id="hide_btn" onClick={handleHideMarkers} style={{ display: 'none' }}>Hide Markers</button>
          <input id="address" className={`input w-full ${darkMode ? "bg-[#ffffff27] text-[var(--text-color-dark)]" : "bg-[#ffffff80]"}}`} type="text" placeholder="Enter address" />
          <button id="btn" className="text-[12px] font-[500] bg-[var(--sidebar-color)] text-white py-1 px-3 rounded mt-1" onClick={handleShowMap}>View on Map</button>
          <input id="latitude" type="text" style={{ display: 'none' }} />
          <input id="longitude" type="text" style={{ display: 'none' }} />
          {searchedLatitude !== "" && (
            <>
              <iframe
                    width="100%"
                    height="400"
                    style={{ border: "none", marginTop: "10px", borderRadius: "10px" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${searchedLatitude},${searchedLongitude}&z=${16}&output=embed`}
                    title="google map"
              >
              </iframe>
              <div className="flex gap-5 mt-2">
                <button className="text-[13px] font-[500] bg-[var(--sidebar-color)] text-white py-1 px-2 rounded mt-1" onClick={fn_addAddress}>Add this Address</button>
                <button className="text-[13px] font-[500] bg-[var(--sidebar-color)] text-white py-1 px-2 rounded mt-1" onClick={fn_changeAddress}>Change Address</button>
              </div>
            </>
          )}
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

const AnyReactComponent = () => <div><MdLocationPin className="text-[30px] " /></div>;

export default CreateForSale;
