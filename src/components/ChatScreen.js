import "./ChatScreen.css";
import { Avatar, IconButton, colors } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import SendIcon from "@material-ui/icons/Send";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import db from "../Firebase";
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { serverTimestamp } from "@firebase/firestore";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { LaptopWindowsSharp, Message, TramSharp } from "@material-ui/icons";

export default function ChatScreen(props) {
  // here it will take the id from the addressbar
  const param = useParams();
  const location = useLocation();
  const avatar = location.state?.chatProfile;
  const [user, setUser] = useState(null);
  const [isSpeech, setIsSpeech] = useState("");

  const appUser = window.localStorage.getItem("appUser");
  useEffect(() => {
    setUser(JSON.parse(appUser));
  }, []);

  // console.log(user["displayName"]);

  const [RoomName, setRoomName] = useState();
  const [MessageInput, setMessageInput] = useState("");
  const [ChatMessages, setChatMessages] = useState([]);

  //Q problem is with not automatic render when msg added to chat
  const AddMessage = (e) => {
    e.preventDefault();
    if (MessageInput === "") {
      return alert("write a message!");
    }
    try {
      addDoc(collection(db, "ChatRooms", param.roomId, "Messages"), {
        name: user.displayName,
        message: MessageInput,
        time: serverTimestamp(),
        // timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        // timestamp: firebase.Xc.firebase_.firestore.FieldValue.serverTimestamp()
        // timestamp: firebase.firestore.FieldValue.serverTimestamp() || null
        // timestamp: db.FieldValue.serverTimestamp()
      });
      console.log("message Added to database");
    } catch {
      console.log("error in sending chat messages");
    }
    //  console.log(firebase.firestore);
    //  console.log(Object.keys(firebase.firestore))
    setMessageInput("");
    // window.location.reload();
  };

  useEffect(() => {
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
      getDocs(collection(db, "ChatRooms", param.roomId, "Messages")).then(
        (QuerySnapshot) => {
          setChatMessages(
            QuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );

          // ChatMessages.map((msg)=>{
          //     console.log(msg);
          // })

          // console.log(ChatMessages.time["seconds"]);
          // console.log(time.getHours()+" "+time.getMinutes()+" "+time.getSeconds());

          // console.log("msgInput: "+ChatMessage.message.MessageInput)
        }
      );
    } catch {
      console.log("Error");
    }

    // console.log("chatmsgs: "+ChatMessage);

    //  (param.roomId)=>{
    //     const d= getDocs(doc(db,"ChatRooms",param.roomId))
    //     console.log("data"+d.data());
    // }

    // getDocs(collection(db,"ChatRooms"))
    // .then((QuerySnapshot)=>{
    //     (QuerySnapshot.docs.map((doc)=>{
    //         if(param.roomId == doc.id){
    //             // setChatMessage()
    //             getDocs(collection(db,"Messages"))
    //             .then((QuerySnapshot)=>{
    //                 (QuerySnapshot.docs.map((doc)=>{
    //                     console.log(doc)
    //                 }))
    //             })
    //         }
    //     }))
    // })
  }, [param.roomId]);
  // console.log(param.roomId);

  // const [transcript, setTranscript] = useState("");
  // const [isListening, setIsListening] = useState(false);

  // const recognition = new window.webkitSpeechRecognition();

  // recognition.onstart = () => {
  //   setIsListening(true);
  // };

  // recognition.onend = () => {
  //   setIsListening(false);
  // };

  // recognition.onresult = (event) => {
  //   const currentTranscript = event.results[0][0].transcript;
  //   console.log(currentTranscript);
  //   setTranscript(currentTranscript);
  // };

  // const toggleListening = () => {
  //   if (isListening) {
  //     recognition.stop();
  //   } else {
  //     recognition.start();
  //   }
  // };

  // NPM Speech
  const { listening, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // console.log("t:\n" + transcript);
  // console.log("check listners " + browserSupportsSpeechRecognition);

  const startListening = () => {
    // setMessageInput(transcript);
    // document.getElementsByClassName("text-bar").value = { transcript };
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
    // return <span>Browser doesn't support speech recognition.</span>;
  }

  // useEffect(() => {
  //   setMessageInput("t\n" + transcript);
  //   console.log("t: " + transcript);
  // }, [transcript]);
  // This useEffect will trigger if any change detected in newContent state
  // useEffect(() => {
  //   console.log("mi:\n" + MessageInput);
  // }, [MessageInput]);

  async function deleteChat() {
    await deleteDoc(doc(db, "ChatRooms", param.roomId, "Messages"));
    window.location.reload();
  }
  return !props.defaultChat ? (
    <div className="chat-screen">
      <div className="chat-header">
        <div className="chat-user">
          <Avatar src={avatar} />
          <div className="chat-info">
            <h3>{RoomName}</h3>
            <p>shows time</p>
          </div>
        </div>
        <div className="header-icons">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon onClick={deleteChat} />
          </IconButton>
        </div>
      </div>

      <div className="chat-body">
        {ChatMessages.map((Message) => {
          var time = new Date(Message.data.time.seconds * 1000);
          // var time = Message.data["time"]["seconds"] * 1000;
          // const hours = Math.floor(time / (1000 * 60 * 60));
          var hours = time.getHours();
          var mins = time.getMinutes();
          var seconds = time.getSeconds();
          // console.log(Message.name);
          // console.log(user.displayName);
          return (
            <>
              <div
                className={`chat-messages ${
                  user.displayName == Message.data.name && `chat-messagesUser`
                }`}
              >
                <h6>{Message.data["name"]}</h6>
                <div className="message-info">
                  <span>{Message.data["message"]}</span>
                  <span className="message-time">
                    {hours + ":" + mins + ":" + seconds}
                  </span>
                </div>
              </div>
            </>
          );
        })}

        {/* <form
          style={{
            color: "black",
            backgroundColor: "green",
            height: "5rem",
          }}
        >
          <p>Microphone: {listening ? "on" : "off"}</p>
          <button onClick={SpeechRecognition.startListening}>Start</button>
          <button onClick={SpeechRecognition.stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <textarea value={transcript}></textarea>
        </form> */}

        {/*       
        <div className="chat-messages chat-receiver">
          <h5>User Name2</h5>
          <div className="message-info">
            <span>Messages3</span>
            <span className="message-time">2:30pm</span>
          </div>
        </div> */}
      </div>

      <div className="chat-footer">
        <IconButton>
          <SentimentVerySatisfiedIcon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>

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
          <button type="submit">
            <IconButton>{/* <SendIcon /> */}</IconButton>
          </button>
        </form>
        <IconButton className="mic-icon">
          <MicIcon
            onTouchStart={startListening}
            onMouseDown={startListening}
            // onTouchEnd={SpeechRecognition.stopListening}
            // onMouseUp={SpeechRecognition.stopListening}
            onTouchEnd={stopListening}
            onMouseUp={stopListening}
          />
          {/* {startListening ? (
            <MicIcon
              onTouchStart={startListening}
              onMouseDown={startListening}
              onTouchEnd={SpeechRecognition.stopListening}
              onMouseUp={SpeechRecognition.stopListening}
            />
          ) : (
            <MicOffIcon />
          )} */}
        </IconButton>
      </div>
      <br />
      <br />
      {/* {isListening ? "Stop Listening" : "Start Listening"} */}
    </div>
  ) : (
    <>
      {/*
        //     <div className='chat-screen'>
        //     <div className='chat-header'>
        //         <div className='chat-user'>
        //             <Avatar />
        //             <div className='chat-info'>
        //                 <h3>ChitChat Community</h3>
        //                 <p>Realtime</p>
        //             </div>
        //         </div>
        //         <div className='header-icons'>
        //             <IconButton>
        //                 <SearchIcon />
        //             </IconButton>
        //             <IconButton>
        //                 <MoreVertIcon />
        //             </IconButton>
        //         </div>
        //     </div>
           
        //     <div className='chat-body'>
                
        //         <div className='chat-messages chat-receiver'>
         //             
        //             <h5>ChitChat Community</h5>
        //             <div className='message-info'>
        //                 <span>Hello! Welcome to our Community</span>
        //                 <span className='message-time'>Realtime</span>
        //             </div>
        //         </div>
        //         <div className='chat-messages '>
        //             <h5>User Name</h5>
        //             <div className='message-info'>
        //                 <span>Messages2  </span>
        //                 <span className='message-time'> 2:30pm</span>
        //             </div>
        //         </div>
        //         <div className='chat-messages chat-receiver'>
        //             <h5>User Name</h5>
        //             <div className='message-info'>
        //                 <span>Messages3  </span>
        //                 <span className='message-time'> 2:30pm</span>
        //             </div>
        //         </div>

        //     </div>

        //     <div className='chat-footer'>
        //         <IconButton>
        //             <SentimentVerySatisfiedIcon />
        //         </IconButton>
        //         <IconButton>
        //             <AttachFileIcon />
        //         </IconButton>
        //         <form className='footer-message' onSubmit={AddMessage}>
        //             <input className='text-bar' value={MessageInput} type='text' placeholder='Type a message' onChange={(e) => {
        //                 setMessageInput(e.target.value)
        //                 // console.log(MessageInput);
        //             }} />
        //             <button type='submit'>
        //                 <IconButton>
        //                     <SendIcon />
        //                 </IconButton>
        //             </button>
        //         </form>
        //         <IconButton className='mic-icon'>
        //             <MicIcon />
        //         </IconButton>
        //     </div>
        // </div> */}
    </>
  );
}
