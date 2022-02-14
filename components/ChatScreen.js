import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail.js";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import moment from "moment";

export default function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const chatId = router.query.id;
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  // const [messagesSnapshot] = useCollection(
  //   query(collection(db, "chats", chatId, "messages"))
  // );

  const showMessages = () => {
    return JSON.parse(messages).map((message) => (
      <Message
        key={message.id}
        user={message.sender}
        text={message.message}
        sentAtTime={new Date(message.sentAtTime.seconds * 1000)}
      />
    ));
  };

  const endOfMessage = useRef();
  const scrollToBottom = () => {
    endOfMessage.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const [input, setInput] = useState();
  const refreshData = () => { router.replace(router.asPath) }
  const sendMessage = (e) => {
    if (!input) return;
    //Update Last Seen on current user
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );
    //Store Message
    const messageData = {
      message: input,
      sender: user.email,
      sentAtTime: Timestamp.fromDate(new Date()),
    };
    addDoc(collection(db, "chats", chatId, "messages"), messageData);
    setInput("");
    refreshData();
  };

  //call add function when Enter is pressed
  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        sendMessage(event);
      }
    };
    document.addEventListener("keydown", listener); //when component is loaded
    return () => {
      document.removeEventListener("keydown", listener); //destroys the component
    };
  }, [input]);

  return (
    <Container onLoad={scrollToBottom}>
      <Header>
        {recipient ? (
          <UserAvatar src={recipient.photoURL}></UserAvatar>
        ) : (
          <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
        )}
        <HeaderInfo>
          {recipientSnapshot ? (
            <h3>{recipient ? recipient.name : recipientEmail}</h3>
          ) : (
            <h3> </h3>
          )}
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate()
                ? moment(recipient?.lastSeen?.toDate()).startOf("day").fromNow()
                : "Unavailable"}
            </p>
          ) : (
            <p>Loading Last active...</p>
          )}
        </HeaderInfo>
        <IconsContainer>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessage} />
      </MessageContainer>

      <InputBar>
        <IconsContainer>
          <IconButton>
            <InsertEmoticonIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </IconsContainer>
        <InputTextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
        />
        <IconButton onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </InputBar>
    </Container>
  );
}

const Container = styled.div`
  flex: 70%;
  min-width: 500px;
  max-width: 2500px;
`;
const Header = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 10px;
  border-bottom: 2px solid whitesmoke;
  background-color: white;
  z-index: 1;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    margin-top: 3px;
    font-size: 14px;
    color: gray;
  }
`;
const IconsContainer = styled.div`
  display: flex;
`;
const MessageContainer = styled.div`
  position: relative;
  background-color: #e4ded9;
  padding: 0 60px;
  height: 77.5vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; //IE, Edge
  scrollbar-width: none; //Firefox
`;
const EndOfMessage = styled.div`
  height: 30px;
`;
const InputBar = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #f0f2f5;
  padding: 10px;
  height: 80px;
  display: flex;
  align-items: center;
`;
const InputTextField = styled.input`
  border: 0;
  outline-width: 0;
  font-size: 15px;
  height: 50px;
  width: 100%;
  padding: 0 15px;
  margin: 0 15px;
  border-radius: 5px;
`;
