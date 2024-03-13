import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Context";
import SidePanel from "./SidePanel";
const Home = () => {
  const { authUser, setUser, isLoggedIn, setIsLoggedIn } = useAuth();

  // the usecontext value is not permanent and goes when page refreshes..
  const [appUser, setAppUser] = useState(null);

  const isLogIn = window.localStorage.getItem("isLoggedIn");
  console.log(isLogIn);
  return (
    <div>
      {!isLogIn ? (
        <Navigate to="/login" />
      ) : (
        <div className="whatsapp-screen">
          <SidePanel />

          <Navigate to="/Chat_Application" />
        </div>
      )}
    </div>
  );
};

export default Home;
