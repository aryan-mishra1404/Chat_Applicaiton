import { createContext, useEffect, useState } from "react";
import "./App.css";
import ChatScreen from "./components/ChatScreen";
import SidePanel from "./components/SidePanel";
import Login from "./Login";
import Footer from "./components/Footer.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./Context/Context";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./components/Home.js";

function App() {
  const { authUser, setUser, isLoggedIn, setIsLoggedIn } = useAuth();

  // the usecontext value is not permanent and goes when page refreshes..
  const [appUser, setAppUser] = useState(null);

  const isLogIn = window.localStorage.getItem("isLoggedIn");

  // console.log(authUser);
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     user = authUser;
  //     console.log("app user: " + user);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     setAppUser(authUser);
  //     // setUser(appUser);
  //     // setIsLoggedIn(isLogIn);
  //   }
  //   console.log("App user: " + authUser);
  //   console.log("App logiN: " + isLoggedIn);
  //   console.log("App user1: " + appUser);
  // }, []);

  return (
    // <Router>
    <>
      <div className="App">
        {!isLogIn ? (
          // <Link to="/login">
          <Login />
        ) : (
          //  </Link>
          <div className="whatsapp-screen">
            <SidePanel />
            <Routes>
              <Route path="/" element={<ChatScreen defaultChat />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/ChatRooms/:roomId" element={<ChatScreen />}></Route>
            </Routes>
          </div>
        )}
        <br />
      </div>

      {/* <Routes>
        <Route exact path="/Chat_Application" element={<Home />} />
        <Route exact path="/ChatRooms/:roomId" element={<ChatScreen />} />
        <Route path="/login" element={<Login />} />
      </Routes> */}
      <Footer />
    </>
    // </Router>
  );
}

export default App;
