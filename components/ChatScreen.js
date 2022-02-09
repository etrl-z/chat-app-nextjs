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
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Timeago } from "timeago-react";

export default function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const chatId = router.query.id;

  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const showMessages = () => {
    return JSON.parse(messages).map((message) => (
      <Message
        key={message.id}
        user={message.sender}
        text={message.message}
        sentAtTime={
          new Date(
            message.sentAtTime.seconds * 1000 +
              message.sentAtTime.nanoseconds / 1000000
          ).getHours() +
          ":" +
          new Date(
            message.sentAtTime.seconds * 1000 +
              message.sentAtTime.nanoseconds / 1000000
          ).getMinutes()
        }
      />
    ));
  };

  const [input, setInput] = useState();
  const sendMessage = (e) => {
    e.preventDefault();
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
    //Resets input field
    setInput("");
    //scrollToBottom();
  };

  const endOfMessage = useRef();
  const scrollToBottom = () => {
    endOfMessage.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
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
              {recipient?.lastSeen?.toDate() ? "<Timeago />" : "Unavailable"}
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
  flex: 60%;
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
  background-color: #e4ded9;
  padding: 0 30px;
  height: 80vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; //IE, Edge
  scrollbar-width: none; //Firefox
`;
const EndOfMessage = styled.div`
  height: 80px;
  bottom: 80px;
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
