import "./Dashboard.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import PagesHeader from "../../Components/PagesHeader/PagesHeader"
import { updatePageNavigation } from "../../Features/Features"
import Section1 from "./Section1";

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("dashboard"));
  }, [dispatch]);
  return (
    <div className="dashboard flex-1">
      <PagesHeader title="Dashboard" nav={"Home"} subnav="" />
      <Section1 />
    </div>
  )
}

export default Dashboard