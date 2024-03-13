import React, { useEffect, useState } from "react";
import "./SidePanel.css";
import SideChats from "./SideChats";
import db from "../Firebase";
import ReplyIcon from "@mui/icons-material/Reply";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { query, onSnapshot } from "firebase/firestore";

import { Avatar, IconButton } from "@material-ui/core";
import CachedIcon from "@mui/icons-material/Cached";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@material-ui/icons/Search";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { initializeApp } from "firebase/app";

function SidePanel() {
  const [ChatRooms, setChatRooms] = useState([]);

  const [user, setUser] = useState(null);
  //   const [userProfile, setProfile] = useState("empty");

  const appUser = window.localStorage.getItem("appUser");
  const userProfile = JSON.parse(appUser).photoURL;
  // console.log(userProfile);
  useEffect(() => {
    setUser(JSON.parse(appUser));
    //its not working hence made a const variable and assign value at the time of parsing
    // setProfile(user["photoURL"]);
  }, []);
  //   console.log(user["photoURL"]);
  //   console.log(userProfile);
  const roomRef = collection(db, "ChatRooms");
  useEffect(() => {
    // console.log("db chat rooms: "+ ChatRooms["id"]);

    const queryMessage = query(roomRef, orderBy("time", "desc"));
    const unsuscribe = onSnapshot(queryMessage, (snapshot) => {
      let rooms = [];
      snapshot.forEach((doc) => {
        rooms.push({ id: doc.id, data: doc.data() });
      });
      setChatRooms(rooms);
    });

    // getDocs(collection(db, "ChatRooms"))
    //   .then(async (QuerySnapshot) => {
    //     setChatRooms(
    //       QuerySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
    //     );
    //     // ChatRooms.map((chat)=>{
    //     //     console.log("db chat rooms: ");
    //     //     console.log(chat.id);
    //     //     console.log(chat.data);
    //     // })
    //   })
    //   .catch((error) => {
    //     console.log("Error " + error);
    //   });
  }, []);

  const createNewRoom = async () => {
    const newChatRoom = prompt("Enter the Room Name");
    // alert(newChatRoom);
    if (newChatRoom) {
      await addDoc(collection(db, "ChatRooms"), {
        Name: newChatRoom,
        time: serverTimestamp(),
      });
      // window.location.reload();
    }
  };

  const pageWidth = document.documentElement.scrollWidth;
  var initialWidth;
  var newWidth;
  if (pageWidth <= "430") {
    initialWidth = "70%";
    newWidth = "25%";
  } else {
    initialWidth = "60%";
    newWidth = "15%";
  }
  // console.log("Initial Width: " + initialWidth);
  const [panelWidth, setWidth] = useState(initialWidth);

  let checkDisplay = 1;

  const togglePanelDisplay = () => {
    let hideElements = document.querySelectorAll(".responsive-icon");

    if (panelWidth == initialWidth) {
      hideElements.forEach((element) => {
        // element.style.visibility = "hidden";
        element.style.display = "none";
      });
      document.querySelector(".hidePanel-icon").style.display = "none";
      document.querySelector(".showPanel-icon").style.display = "inline-block";
      setWidth(newWidth);
      console.log("width changed to: " + newWidth);
      // checkDisplay = 0;
    } else {
      setWidth(initialWidth);
      console.log("width changed to:" + initialWidth);
      hideElements.forEach((element) => {
        // element.style.visibility = "hidden";
        element.style.display = "inline-block";
      });

      document.querySelector(".hidePanel-icon").style.display = "inline-block";
      document.querySelector(".showPanel-icon").style.display = "none";

      // checkDisplay = 1;
    }
  };
  return (
    <div className="side-panel" style={{ width: `${panelWidth}` }}>
      <div className="panel-header">
        <Avatar src={userProfile} />
        <div className="header-icons ">
          {/* <span className="responsive-icon">
            <IconButton>
              <CachedRoundedIcon />
            </IconButton>
          </span> */}

          {/* <IconButton>
            <ChatIcon />
          </IconButton> */}

          <span className="responsive-icon">
            <IconButton>
              <LogoutIcon
                onClick={() => {
                  // window.localStorage.setItem("isLoggedIn", false);
                  // window.localStorage.setItem("appUser", null);
                  window.localStorage.clear();
                  window.location.reload();
                }}
              />
            </IconButton>
          </span>
          <span className="toggle-panel hidePanel-icon">
            <IconButton onClick={togglePanelDisplay}>
              <ReplyIcon />
            </IconButton>
          </span>

          <span
            className="toggle-panel showPanel-icon"
            style={{ display: "none" }}
          >
            <IconButton onClick={togglePanelDisplay}>
              <ShortcutIcon fontSize="small" />
            </IconButton>
          </span>
        </div>
      </div>
      <div className="panel-search">
        <div className="search-bar">
          <span className="responsive-icon hide-icon">
            <SearchIcon />
          </span>
          <input
            className="responsive-icon"
            type="text"
            placeholder="Search the chat"
            disabled
          ></input>
        </div>
        <span className="responsive-icon">
          <IconButton>
            <PersonAddIcon onClick={createNewRoom} />
          </IconButton>
        </span>
      </div>

      <div className="side-chats">
        {/* this allows a default chat when acceed in sideChats.js */}
        {/* {console.log(ChatRooms)} */}
        <SideChats addNewChat="true" />
        {ChatRooms.map((chat) => {
          // console.log(chat.id, chat.data)
          return (
            <SideChats key={chat.id} id={chat.id} name={chat.data["Name"]} />
          );
        })}
      </div>

      {/* <SideChats/> */}
    </div>
  );
}
export default SidePanel;
