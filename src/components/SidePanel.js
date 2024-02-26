import React, { useEffect, useState } from "react";
import "./SidePanel.css";
import SideChats from "./SideChats";
import db from "../Firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

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

  useEffect(() => {
    // console.log("db chat rooms: "+ ChatRooms["id"]);
    getDocs(collection(db, "ChatRooms"))
      .then(async (QuerySnapshot) => {
        setChatRooms(
          QuerySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
        // ChatRooms.map((chat)=>{
        //     console.log("db chat rooms: ");
        //     console.log(chat.id);
        //     console.log(chat.data);
        // })
      })
      .catch((error) => {
        console.log("Error " + error);
      });
  }, []);

  const createNewRoom = async () => {
    const newChatRoom = prompt("Enter the Room Name");
    // alert(newChatRoom);
    if (newChatRoom) {
      await addDoc(collection(db, "ChatRooms"), {
        Name: newChatRoom,
      });
      window.location.reload();
    }
  };
  return (
    <div className="side-panel">
      <div className="panel-header">
        <Avatar src={userProfile} />
        <div className="header-icons">
          <IconButton>
            <DonutLargeIcon
              onClick={() => {
                // window.localStorage.setItem("isLoggedIn", false);
                // window.localStorage.setItem("appUser", null);
                window.localStorage.clear();
                window.location.reload();
              }}
            />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="panel-search">
        <div className="search-bar">
          <SearchIcon />
          <input type="text" placeholder="Search the chat"></input>
        </div>
        {/* <button > */}
        <IconButton>
          <PersonAddIcon onClick={createNewRoom} />
        </IconButton>
        {/* </button> */}
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
