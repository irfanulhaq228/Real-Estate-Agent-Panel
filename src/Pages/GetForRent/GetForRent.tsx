import "./GetForRent.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState, updatePageNavigation } from "../../Features/Features";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { deleteRentalHomeById, getRentalHomes } from "../../Api/api";
import { IMAGE_URL } from "../../url";

import { MdDelete, MdEditSquare } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import toast from "react-hot-toast";
import ViewForRent from "./ViewForRent";

const { confirm } = Modal;

const GetForRent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ viewHome, setViewHome ] = useState(false);
  const [ singleData, setSingleData ] = useState({});
  const darkMode = useSelector((state: RootState) => state.darkMode);
  const [data, setData]: any[] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await getRentalHomes();
        if (result?.status === 200) {
          setData(result?.data?.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    dispatch(updatePageNavigation("forRent"));
  }, [dispatch]);
  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "Do you want to delete this rental home ?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const updatedData = data.filter((item: any) => item?._id !== id);
        setData(updatedData);
        const deleteApi = async () => {
          const result: any = await deleteRentalHomeById(id);
          if (result?.status === 200) {
            toast.success("Data Deleted !");
          }
        };
        deleteApi();
      },
    });
  };
  const fn_viewInfo = (data: any) => {
    setSingleData(data);
    setViewHome(true);
  }
  return (
    <div className="get-for-rent">
      <PagesHeader title="Homes For Rent" nav={"Homes For Rent"} subnav="" />
      {viewHome && (
        <ViewForRent viewHome={viewHome} setViewHome={setViewHome} singleData={singleData} />
      )}
      <div className="m-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="font-[600] text-[grey] text-[13px]">
          Details of Rental Homes
        </p>
        <p
          className={`font-[600] text-[14px] cursor-pointer px-[15px] bg-[var(--table-heading-bg)] h-[40px] flex items-center rounded ${
            darkMode && "text-[var(--text-color-dark)]"
          }`}
          onClick={() => navigate("/rental-homes/create")}
        >
          Request for Rental Home ?
        </p>
      </div>
      <div className="bg-[var(--portion-bg-color)] m-1 sm:m-5 rounded py-5 px-2 sm:p-5">
        <div className="max-h-[250px] overflow-y-scroll">
          <table className="w-full">
            <thead>
              <tr
                className={`text-[9px] sm:text-[10px] md:text-[12px] font-[600] h-[45px] bg-[var(--table-heading-bg)] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                <td>&nbsp;Sr #</td>
                <td className="ps-1">Images</td>
                <td className="ps-1">Title</td>
                <td className="ps-1 hidden sm:table-cell">Address</td>
                <td className="ps-1 hidden sm:table-cell">Monthly Price</td>
                <td className="ps-1 hidden sm:table-cell">Bedrooms</td>
                <td className="ps-1 hidden sm:table-cell">Bathrooms</td>
                <td className="ps-1">Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0  ? data?.map((item: any, index: number) => (
                <tr
                key={index}
                className={`text-[9px] sm:text-[10px] md:text-[12px] h-[40px] border-b border-[var(--border-color)] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}
              >
                <td className="font-[600]">&nbsp;{index+1}</td>
                <td className="ps-1">
                  <img src={`${IMAGE_URL}/${item?.images[0]}`} className="h-[50px] w-[80px] rounded" style={{ objectFit: "cover" }} />
                </td>
                <td className="ps-1">{item?.title}</td>
                <td className="ps-1 hidden sm:table-cell">{item?.address}</td>
                <td className="ps-1 hidden sm:table-cell">$ {item?.monthlyPrice}</td>
                <td className="ps-1 hidden sm:table-cell">{item?.bedrooms}</td>
                <td className="ps-1 hidden sm:table-cell">{item?.bathrooms}</td>
                <td className="ps-1">
                  <span className={`${item?.status ? "bg-[green]" : "bg-[red]"} p-1 rounded-full text-[9px] font-[500] text-white`}>{item?.status ? "Approved" : "Pending"}</span>
                </td>
                <td className="flex items-center h-[50px] gap-1">
                  <MdDelete className="text-[17px] cursor-pointer hover:scale-[1.1]" onClick={() => showDeleteConfirm(item?._id)}  />
                  {/* <MdEditSquare className="text-[17px] cursor-pointer hover:scale-[1.1]" /> */}
                  <IoMdEye onClick={() => fn_viewInfo(item)} className="text-[19px] cursor-pointer hover:scale-[1.12]" />
                </td>
              </tr>
              )) : (
                <td colSpan={9} className={`text-[9px] sm:text-[10px] md:text-[12px] h-[45px] text-center border-b border-[var(--border-color)] ${
                  darkMode && "text-[var(--text-color-dark)]"
                }`}>
                  No Data Found
                </td>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GetForRent;
