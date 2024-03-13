import { Avatar } from "@material-ui/core";
import "./SideChats.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SideChats(props) {
  const [avatar, setAvatar] = useState();
  const [lastMessage, setLastMessage] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const avatarValue = Math.floor(Math.random() * 1000);
    setAvatar(avatarValue);
    // console.log(Math.floor(Math.random() * 1000));

    try {
      getDocs(
        collection(db, "ChatRooms", `${props.id}`, "Messages")
        // orderBy("timestamp", "desc")
      ).then((QuerySnapshot) => {
        setLastMessage(
          QuerySnapshot.docs.map((doc) => ({
            // console.log(doc);
            id: doc.id,
            data: doc.data(),
          }))
        );
        // lastMessage.map((msg) => {
        //   console.log("msg" + msg);
        // });
      });
    } catch {
      console.log("Error");
    }
  }, []);

  //
  return !props.addNewChat ? (
    <a
      onClick={() => {
        console.log(avatar);
        navigate(`/ChatRooms/${props.id}`, {
          // state: {
          //   profilePhoto: { avatar },
          // },
        });
      }}
    >
      <div className="panel-chats">
        <Avatar
          src={`https://i.pravatar.cc/${avatar}`}
          alt="avatar"
          start="imgae"
        />
        <div className="chat-info responsive-icon">
          <h3>{props.name}</h3>
          {/* <p>{lastMessage.data[0]}</p> */}
        </div>
      </div>
    </a>
  ) : (
    <>
      {/* <div className='panel-chats'>
                    <Avatar src={`https://i.pravatar.cc/${avatar}`}/>
                    <div className='chat-info'>
                        <h3>Chit Chat Community</h3>
                        <p>lastChat</p> 
                    </div>
                </div>
                 */}
    </>
  );
}
