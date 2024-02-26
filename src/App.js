import { createContext, useEffect, useState } from "react";
import "./App.css";
import ChatScreen from "./components/ChatScreen";
import SidePanel from "./components/SidePanel";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./Context/Context";
import { auth } from "./Firebase";

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
    <div className="App">
      {!isLogIn ? (
        <Login />
      ) : (
        <div className="whatsapp-screen">
          {/* <h1>Jai Shree Ram🙏</h1> */}
          <SidePanel />
          <Routes>
            <Route path="/" element={<ChatScreen defaultChat />}></Route>
            <Route path="/ChatRooms/:roomId" element={<ChatScreen />}></Route>
          </Routes>
        </div>
      )}
    </div>
    // </Router>
  );
}

export default App;
