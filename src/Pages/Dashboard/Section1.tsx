import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Features/Features";

const Section1 = () => {
  const darkMode = useSelector((state: RootState) => state.darkMode);
  useEffect(() => {
    const boxe1: any = document.getElementById("box1");
    const boxe2: any = document.getElementById("box2");
    const boxe3: any = document.getElementById("box3");
    setTimeout(() => {
      boxe1.classList.add("animate-opacity");
    }, 200);
    setTimeout(() => {
      boxe2.classList.add("animate-opacity");
    }, 400);
    setTimeout(() => {
      boxe3.classList.add("animate-opacity");
    }, 600);
  }, []);
  return (
    <div
      className={`section-1 m-5 rounded-lg p-5 flex gap-5 ${
        !darkMode && "bg-white"
      }`}
    >
      <div
        className="box1 bg-[var(--sidebar-color)] flex-1 rounded-lg text-white px-3 py-5"
        id="box1"
      >
        <p className="text-[18px] font-[700] mb-3">Rental Homes</p>
        <p className="text-[14px] font-[500] text-gray-300">Approved : 5</p>
        <p className="text-[14px] font-[500] text-gray-300">Pending : 2</p>
      </div>
      <div
        className="box2 bg-[var(--sidebar-color)] flex-1 rounded-lg text-white px-3 py-5"
        id="box2"
      >
        <p className="text-[18px] font-[700] mb-3">Homes for Sale</p>
        <p className="text-[14px] font-[500] text-gray-300">Approved : 1</p>
        <p className="text-[14px] font-[500] text-gray-300">Pending : 1</p>
      </div>
      <div
        className="box3 bg-[var(--sidebar-color)] flex-1 rounded-lg text-white px-3 py-5"
        id="box3"
      >
        <p className="text-[18px] font-[700] mb-3">Condo Homes</p>
        <p className="text-[14px] font-[500] text-gray-300">Approved : 2</p>
        <p className="text-[14px] font-[500] text-gray-300">Pending : 0</p>
      </div>
    </div>
  );
};

export default Section1;
