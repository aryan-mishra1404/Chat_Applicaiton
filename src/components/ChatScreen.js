import "./ChatScreen.css";
import { Avatar, IconButton, Paper, colors } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import ReplyIcon from "@mui/icons-material/Reply";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import SendIcon from "@material-ui/icons/Send";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import db, { auth, imageDB } from "../Firebase";
import EmojiPicker from "emoji-picker-react";
import ShortUniqueId from "short-unique-id";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { serverTimestamp } from "@firebase/firestore";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  LaptopWindowsSharp,
  Message,
  TramSharp,
  Widgets,
} from "@material-ui/icons";
import {
  BoyRounded,
  DisplaySettingsSharp,
  WidthFull,
} from "@mui/icons-material";
import uuid from "react-uuid";
import { formGroupClasses } from "@mui/material";

export default function ChatScreen(props) {
  // here it will take the id from the addressbar
  const param = useParams();
  const location = useLocation();
  // console.log(location.state.profilePhoto);
  const [user, setUser] = useState(null);
  const [isSpeech, setIsSpeech] = useState("");
  const [display, setDisplay] = useState("none");
  const appUser = window.localStorage.getItem("appUser");

  const fileRef = useReducer(null);
  useEffect(() => {
    setUser(JSON.parse(appUser));
  }, []);

  // console.log(user["displayName"]);

  const [RoomName, setRoomName] = useState();
  const [MessageInput, setMessageInput] = useState("");
  const [file, setFile] = useState("");
  const [ChatMessages, setChatMessages] = useState([]);

  const [isMsgSent, setisMsg] = useState(false);
  //Q problem is with not automatic render when msg added to chat
  const AddMessage = (e) => {
    e.preventDefault();
    if (MessageInput === "" && file === "") {
      return alert("write a message!");
    }
    try {
      // console.log(auth.currentUser.displayName);
      addDoc(collection(db, "ChatRooms", param.roomId, "Messages"), {
        name: auth.currentUser.displayName,
        message: MessageInput,
        file: file,
        time: serverTimestamp(),
      });
      // console.log("message Added to database");
    } catch {
      console.log("error in sending chat messages");
    }
    setisMsg((bool) => !bool);
    setMessageInput("");
    setFile("");
    // window.location.reload();
  };
  const messageRef = collection(db, "ChatRooms", param.roomId, "Messages");
  useEffect(() => {
    // const getChatData = async () => {
    getDocs(collection(db, "ChatRooms")).then((QuerySnapshot) => {
      QuerySnapshot.docs.map((doc) => {
        if (param.roomId === doc.id) {
          setRoomName(doc.data()["Name"]);
        }
      });
      // console.log(RoomName);
    });

    // Query a reference to a subcollection
    try {
      const queryMessage = query(messageRef, orderBy("time", "desc"));
      // .collection("Messages")
      const unsuscribe = onSnapshot(queryMessage, (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, data: doc.data() });
          // console.log(doc.id);
          // console.log(doc.data());
        });
        setChatMessages(messages);
      });
      // getDocs(collection(db, "ChatRooms", param.roomId, "Messages")).then(
      //   (QuerySnapshot) => {
      //     let msgs = [];
      //     QuerySnapshot.docs.forEach((doc) => {
      //       msgs.push({ id: doc.id, data: doc.data() });
      //       console.log(doc.id);
      //     });
      //     setChatMessages(
      //       msgs
      //       // QuerySnapshot.docs.map((doc) => ({
      //       //   id: doc.id,
      //       //   data: doc.data(),
      //       // }))
      //     );
      //     console.log("chat data fetch");
      //   }
      // );
    } catch {
      console.log("Error");
    }
  }, [param.roomId]);

  // NPM Speech
  const { listening, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
    // setIsSpeech(true);
  };
  const stopListening = () => {
    // setMessageInput("");
    SpeechRecognition.stopListening();
    // setMessageInput(isSpeech);
    // setIsSpeech(false);
  };
  if (!browserSupportsSpeechRecognition) {
    alert("Not Suppported");
  }

  async function deleteChat() {
    await deleteDoc(doc(db, "ChatRooms", param.roomId, "Messages"));
    window.location.reload();
  }
  ///////////////////IMAGE UPLOAD................//////////////
  const { randomUUID } = new ShortUniqueId({ length: 10 });

  function handleUpload(e) {
    console.log(e.target.files[0]);
    const imgs = ref(imageDB, `Images/${randomUUID()}`);
    uploadBytes(imgs, e.target.files[0]).then((data) => {
      console.log(data, "imgs");
      getDownloadURL(data.ref).then((val) => {
        console.log(val);
        setFile(val);
      });
    });
  }
  return !props.defaultChat ? (
    <div className="chat-screen" style={{ display: "block" }}>
      <div className="chat-header">
        <div className="chat-user">
          {/* <Avatar
            src={`https://i.pravatar.cc/${location.state.profilePhoto}`}
          /> */}
          <div className="chat-info chat-header-name">
            <h3>{RoomName}</h3>
            <p>
              {/* {d.getHours()} : {d.getMinutes()} */}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="header-icons chat-header-icon">
          {/* <IconButton>
            <SearchIcon />
          </IconButton> */}
          <IconButton>
            <MoreVertIcon
            // onClick={deleteChat}
            />
          </IconButton>
        </div>
      </div>

      <div className="chat-body">
        {ChatMessages.map((Message) => {
          // var time = new Date(Message.data.time.seconds * 1000);
          // var hours = time.getHours();
          // var mins = time.getMinutes();
          // var seconds = time.getSeconds();

          // var time = Message.data["time"]["seconds"] * 1000;
          // const hours = Math.floor(time / (1000 * 60 * 60));
          // console.log(Message.name);
          // console.log(user.displayName);
          // console.log(Message.data.file);
          return (
            <>
              <div
                className={`chat-messages ${
                  user.displayName == Message.data.name && `chat-messagesUser`
                }`}
              >
                <h6>{Message.data["name"]}</h6>
                <div className="message-info">
                  <span style={{ fontSize: ".8rem" }}>
                    {Message.data.file && Message.data.message ? (
                      <>
                        {Message.data.message}
                        <img
                          style={{
                            width: "10rem",
                            borderRadius: "7px",
                            padding: "1rem 0",
                          }}
                          src={Message.data.file}
                          alt="chat-img"
                        />
                      </>
                    ) : (
                      <>
                        {Message.data["file"] !== "" ? (
                          <>
                            <img
                              style={{
                                width: "12rem",
                                borderRadius: "7px",
                                padding: "1rem 0",
                              }}
                              src={Message.data.file}
                              alt="chat-img"
                            />
                          </>
                        ) : (
                          Message.data["message"]
                        )}
                      </>
                    )}
                  </span>
                  {/* <span className="message-time" style={{ fontSize: ".5rem" }}>
                    {hours + ":" + mins + ":" + seconds}  
                  </span> */}
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div className="chat-footer">
        <IconButton>
          <SentimentVerySatisfiedIcon color="disabled" />
        </IconButton>
        {/* <EmojiPicker className="emoji" /> */}
        <IconButton
          onClick={() => {
            fileRef.current.click();
          }}
        >
          <AttachFileIcon />
        </IconButton>
        <input
          type="file"
          accept="images/*"
          onChange={(e) => {
            handleUpload(e);
            // setFile(URL.createObjectURL(e.target.files[0]));
          }}
          ref={fileRef}
          className="file-input"
          style={{ display: "none" }}
        ></input>

        <form className="footer-message" onSubmit={AddMessage}>
          <input
            className="text-bar"
            type="text"
            placeholder="Type a message"
            // value={stopListening ? { transcript } : MessageInput}
            value={MessageInput}
            onChange={(e) => {
              console.log(listening);
              console.log("input value: " + e.target.value);
              console.log("transcript value: " + transcript);
              setMessageInput(e.target.value);
            }}
          />
          {/* <button type="submit"> */}
          {/* </button> */}
        </form>
        <IconButton onClick={AddMessage}>
          <SendRoundedIcon />
        </IconButton>

        <Paper className="file-preview">
          <img src={file} style={{ width: "50px" }}></img>
        </Paper>
        {/* <IconButton className="mic-icon">
          <MicIcon
            onTouchStart={startListening}
            onMouseDown={startListening}
            // onTouchEnd={SpeechRecognition.stopListening}
            // onMouseUp={SpeechRecognition.stopListening}
            onTouchEnd={stopListening}
            onMouseUp={stopListening}
          />
          
        </IconButton> */}
      </div>
      <br />
      <br />
      {/* {isListening ? "Stop Listening" : "Start Listening"} */}
    </div>
  ) : (
    <div className="chat-screen" style={{ display: "block" }}>
      <div className="chat-body">Ram Ram Ji</div>
    </div>
  );
}
