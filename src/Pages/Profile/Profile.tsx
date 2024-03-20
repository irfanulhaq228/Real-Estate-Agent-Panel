import { useDispatch } from "react-redux";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";
import { useEffect } from "react";
import { updatePageNavigation } from "../../Features/Features";

const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updatePageNavigation("profile"));
  }, [dispatch]);
  return (
    <div className="flex-1">
      <PagesHeader title="Profile" nav={"Profile"} />
    </div>
  );
};

export default Profile;
