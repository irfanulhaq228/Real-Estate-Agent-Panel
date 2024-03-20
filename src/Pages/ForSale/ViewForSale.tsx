import { Modal, Carousel } from "antd";
import { IMAGE_URL } from "../../url";

import { BsDot } from "react-icons/bs";

//@ts-ignore
const ViewForSale = ({ viewHome, setViewHome, singleData }) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };
  return (
    <Modal
      title="View Home for Sale"
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
        <Carousel afterChange={onChange} autoplay={true} autoplaySpeed={3000} infinite={true}>
          {singleData?.images?.map((item: any) => (
            <div>
              <img src={`${IMAGE_URL}/${item}`} className="h-[250px] w-full object-cover object-center rounded-[10px]" />
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
          <div className="flex flex-col md:col-span-2">
            <p className="font-[600] text-[13px]">Address</p>
            <p className="text-[13px]">{singleData?.address}</p>
          </div>
          <div className="flex flex-col md:col-span-2">
            <p className="font-[600] text-[13px]">Sale Price</p>
            <p className="text-[13px]">$ {singleData?.salePrice}</p>
          </div>
          {singleData?.property === "house" ? (
            <>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px]">Lot Sqft.</p>
                <p className="text-[13px]">{singleData?.lotSqft} sqft.</p>
              </div>
              <div className="flex flex-col">
                <p className="font-[600] text-[13px]">Building Size</p>
                <p className="text-[13px]">{singleData?.buildingSize} sqft.</p>
              </div>
            </>
          ) : null}
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
                <BsDot className="text-[25px]" /><p className="text-[13px] capitalize">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <p className="font-[600] text-[13px]">Services</p>
            {singleData?.services?.split(",")?.map((item: any) => (
              <div className="flex items-center">
                <BsDot className="text-[25px]" /><p className="text-[13px] capitalize">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div>
          <p className="font-[600] text-[13px] mb-2 mt-4">Images</p>
          <video width="640" height="360" controls className="rounded-[10px]">
            <source src={`${IMAGE_URL}/${singleData?.video}`} type="video/mp4" />
          </video>
        </div>
      </div>
      <hr />
    </Modal>
  );
};

export default ViewForSale;
