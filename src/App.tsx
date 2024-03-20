import "./App.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // useLocation
} from "react-router-dom";

import { RootState, updateLogin } from "./Features/Features";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Setting from "./Pages/Setting/Setting";
import ForRent from "./Pages/ForRent/ForRent";
import SignUp from "./Pages/Auth/SignUp";
import Signin from "./Pages/Auth/Signin";
import Profile from "./Pages/Profile/Profile";
import GetForRent from "./Pages/GetForRent/GetForRent";
import EditForRent from "./Pages/ForRent/EditForRent";
import ForSale from "./Pages/ForSale/ForSale";
import CreateForSale from "./Pages/ForSale/CreateForSale";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.darkMode);
  const loggedIn = useSelector((state: RootState) => state.loggedIn);
  // const location = useLocation();

  // const hideSidebarAndNavbar = location.pathname === "/sign-up" || location.pathname === "/sign-in";

  useEffect(() => {
    if(localStorage.getItem('agent')){
      dispatch(updateLogin(true));
    }
  }, [])

  return (
    <div className={`${!darkMode ? "bg-[#F1F5F9]" : "bg-[#24303F]"} flex min-h-screen`}>
      {loggedIn && <Sidebar />}
      <div className="flex-1">
        {loggedIn && <Navbar />}
        <Routes>
          
          {loggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/*" element={<Dashboard />} />

              <Route path="/rental-homes" element={<GetForRent />} />
              <Route path="/rental-homes/create" element={<ForRent />} />
              <Route path="/rental-homes/edit/:id" element={<EditForRent />} />

              <Route path="/sell-homes" element={<ForSale />} />
              <Route path="/sell-homes/create" element={<CreateForSale />} />

              <Route path="/setting" element={<Setting />} />
              <Route path="/profile" element={<Profile />} />
            </>
          ) : (
            <>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/*" element={<Signin />} />
            </>
          )}

        </Routes>
      </div>
    </div>
  );
}

export default App;
