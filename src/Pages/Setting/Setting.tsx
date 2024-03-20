import { useDispatch } from "react-redux";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { useEffect } from "react";
import { updatePageNavigation } from "../../Features/Features";

const Setting = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updatePageNavigation("setting"));
  }, [dispatch]);
  return (
    <div className="flex-1">
      <PagesHeader title="Setting" nav={"Setting"} />
    </div>
  );
};

export default Setting;
