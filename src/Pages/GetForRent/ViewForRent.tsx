import { useState } from "react";
import { Modal, Carousel } from "antd";
import { IMAGE_URL } from "../../url";

import { BsDot } from "react-icons/bs";

//@ts-ignore
const ViewForRent = ({ viewHome, setViewHome, singleData }) => {
  const [ mapShows, setmapShows ]:any = useState(); 
  return (
    <Modal
      title="View Rental Home"
      style={{ top: 20 }}
      open={viewHome}
      onOk={() => setViewHome(false)}
      onCancel={() => setViewHome(false)}
      width={600}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{
        style: { backgroundColor: "var(--sidebar-color)", color: "white" },
      }}
      cancelText="Close"
    >
      <hr />
      <div style={{ fontFamily: "Montserrat" }} className="my-5">
        <p className="font-[600] text-[13px] mb-2">Images</p>
        <Carousel autoplay={true} autoplaySpeed={3000} infinite={true}>
          {singleData?.images?.map((item: any) => (
            <div>
              <img
                src={`${IMAGE_URL}/${item}`}
                className="h-[250px] w-full object-cover object-center rounded-[10px]"
              />
            </div>
          ))}
        </Carousel>
        <hr className="mt-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-5">
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Property Type</p>
            <p className="text-[13px] capitalize">{singleData?.property}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Title</p>
            <p className="text-[13px]">{singleData?.title}</p>
          </div>
          <div className="flex flex-col md:col-span-2 md:mb-3">
            <p className="font-[600] text-[13px]">Address</p>
            <p className="text-[13px]">{singleData?.address}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Monthly Rent</p>
            <p className="text-[13px]">$ {singleData?.monthlyPrice}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Advance Payment</p>
            <p className="text-[13px]">$ {singleData?.advancePayment}</p>
          </div>
          {singleData?.petFees && (
            <div className="flex flex-col md:col-span-2">
              <p className="font-[600] text-[13px]">Pet Fees</p>
              <p className="text-[13px]">$ {singleData?.petFees}</p>
            </div>
          )}
          {singleData?.property !== "appartment" ? (
            <>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px] md:mt-3">Sqft.</p>
                <p className="text-[13px]">{singleData?.sqft} sqft.</p>
              </div>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px]">Acre</p>
                <p className="text-[13px]">{(parseInt(singleData?.sqft)/43560).toFixed(2)} acre</p>
              </div>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px]">Lot Sqft.</p>
                <p className="text-[13px]">{singleData?.lotSqft} sqft.</p>
              </div>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px]">Lot Acre</p>
                <p className="text-[13px]">{(parseInt(singleData?.lotSqft)/43560).toFixed(2)} acre</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:mt-3 md:col-span-2">
                <p className="font-[600] text-[13px]">Sqft.</p>
                <p className="text-[13px]">{singleData?.sqft} sqft.</p>
              </div>
            </>
          )}
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">No. of Bedrooms</p>
            <p className="text-[13px]">{singleData?.bedrooms}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">No. of Bathrooms</p>
            <p className="text-[13px]">{singleData?.bathrooms}</p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2 my-5">
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Detailed Overview</p>
            <p className="text-[13px] capitalize">{singleData?.overview}</p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2 my-5">
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Key Features</p>
            {singleData?.keyFeatures?.split(",")?.map((item: any) => (
              <div className="flex items-center">
                <BsDot className="text-[25px]" />
                <p className="text-[13px] capitalize">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Services</p>
            {singleData?.services?.split(",")?.map((item: any) => (
              <div className="flex items-center">
                <BsDot className="text-[25px]" />
                <p className="text-[13px] capitalize">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div>
          <p className="font-[600] text-[13px] mb-2 mt-4">Video</p>
          <video width="640" height="360" controls className="rounded-[10px]">
            <source
              src={`${IMAGE_URL}/${singleData?.video}`}
              type="video/mp4"
            />
          </video>
        </div>
        <hr className="mt-5" />
        <div>
          <p className="font-[600] text-[13px] mb-2 mt-4">Nearby Areas</p>
          <div className="flex flex-col gap-2">
            {singleData?.nearbyAddresses && singleData?.nearbyAddresses?.map((item: any, index: any) => (
              <div className="bg-[var(--border-color)] py-2 px-1 rounded-[5px]">
                <div className="flex items-center">
                  <BsDot className="text-[25px]" />
                  <p className="text-[13px]">{item?.address}</p>
                </div>
                <div className="text-right">
                  <button className="text-[12px] font-[600] text-[var(--sidebar-color)] py-1 px-2 rounded mt-1 hover:underline" onClick={() => {if(mapShows === index){setmapShows()}else{setmapShows(index)}}}>{mapShows === index ? "Close Map" : "View on Map"}</button>
                </div>
                {mapShows ===index && (
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: "none", marginTop: "10px", borderRadius: "10px" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${item?.lat},${item?.lon}&z=${12}&output=embed`}
                    title="google map"
                  >
                  </iframe>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr />
    </Modal>
  );
};

export default ViewForRent;
