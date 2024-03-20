import { useEffect } from "react";
import { useDispatch } from "react-redux";

import PagesHeader from "../../Components/PagesHeader/PagesHeader"
import { updatePageNavigation } from "../../Features/Features"

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("dashboard"));
  }, [dispatch]);
  return (
    <div className="flex-1">
      <PagesHeader title="Dashboard" nav={"Home"} />
    </div>
  )
}

export default Dashboard