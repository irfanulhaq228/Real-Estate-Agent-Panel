import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { RootState, updateLogin, updateNewMsgs } from "./Features/Features";
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
import Contact from "./Pages/Contact/Contact.jsx";

import { SOCKET_URL } from "./url.js";
const socket = io(SOCKET_URL);

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
  const notifyMsgs = useSelector((state: RootState) => state.newMsgs);

  const [newMessage, setNewMessage] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("agent")) {
      dispatch(updateLogin(true));
    }
  }, []);

  useEffect(() => {
    const handleMessage = (msg: any) => {
      setNewMessage((prev: any) => [...prev, { ...msg }]);
    };
    socket.on("msg", handleMessage);
    return () => {
      socket.off("msg", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (newMessage?.length > 0) {
      const newMsg = newMessage?.[0];
      dispatch(updateNewMsgs([...notifyMsgs, { ...newMsg }]));
      setTimeout(() => {
        setNewMessage([]);
      }, 500);
    }
  }, [newMessage]);

  return (
    <div
      className={`${
        !darkMode ? "bg-[#F1F5F9]" : "bg-[#24303F]"
      } flex min-h-screen`}
    >
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

              <Route path="/contacts" element={<Contact />} />

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
