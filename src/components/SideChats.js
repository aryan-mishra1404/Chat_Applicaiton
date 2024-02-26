import { Avatar } from "@material-ui/core";
import "./SideChats.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../Firebase";
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function SideChats(props) {
  const [avatar, setAvatar] = useState("");
  const [lastMessage, setLastMessage] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    setAvatar(Math.floor(Math.random() * 1000));
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
        lastMessage.map((msg) => {
          // console.log("msg" + msg);
        });
      });
    } catch {
      console.log("Error");
    }
  }, []);

  // console.log("newChat" + props.addNewChat);
  return !props.addNewChat ? (
    <div className="panel-chats">
      <Avatar src={`https://i.pravatar.cc/${avatar}`} />
      <div className="chat-info">
        <Link to={`/ChatRooms/${props.id}`}>
          <h3>{props.name}</h3>
        </Link>
      </div>
      {/* <p>{lastMessage.data[0]}</p> */}

      {/* <div className="chat-info" onClick={navigate(`/ChatRooms/${props.id}`)}>
        <h3>{props.name}</h3>
      </div> */}
    </div>
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
