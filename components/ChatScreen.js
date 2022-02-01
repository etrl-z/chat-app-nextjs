import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message.js";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, setDoc, query, where } from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail.js";
import React, { useRef } from "react";

export default function ChatScreen() {
  const messages = [
    "Hello to the friends from all the world!",
    "Danke Bitte!",
    "Hola Amigos de todo lo mundo!",
    "Se nì mondo esistesse un pò di bene e ognun si considerasse suo fratello ci sarebbero meno pensieri e meno pene ed il mondo ne sarebbe assai più bello.",
  ];

  const router = useRouter();
  const [user] = useAuthState(auth);
  const [chatsSnapshot] = useCollection(
    query(collection(db, "chats"), where("users", "array-contains", user.email))
  );
  const chatSnap = chatsSnapshot?.docs.find(
    (chat) => chat.id == router.query.id
  );
  const chatEmail = getRecipientEmail(chatSnap?.data().users, user);
  const chatMessages = collection(db, `chats/${chatSnap?.id}/messages`);

  const textInputField = useRef();
  const sendMessage = () => {
    const messageTxt = textInputField.current.value; //read input field value
    if (messageTxt === "") return;
    setDoc(
      doc(chatMessages),
      {
        message: messageTxt,
        sender: user.email,
        sentAtTime: new Date().getHours() + ":" + new Date().getMinutes(),
      },
      { merge: true }
    );
    textInputField.current.value = null; //resets input field
  };

  return (
    <Container>
      <Header>
        <UsrAvatar />
        <HeaderInfo>
          <h3>{chatEmail}</h3>
          <p>Last seen...</p>
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
        {messages.map((message) => (
          <Message text={message} />
        ))}
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
        <InputTextField ref={textInputField} placeholder="Write a message..." />
        <IconButton onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </InputBar>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  display: flex;
  align-items: center;
  width: 100%;
  height: 10vh;
  padding: 10px;
  border-bottom: 2px solid whitesmoke;
  background-color: white;
  z-index: 1;
`;
const UsrAvatar = styled(Avatar)`
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
  width: 100%;
  min-height: 80vh;
  padding: 30px;
`;
const InputBar = styled.div`
  background-color: #f0f2f5;
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
  padding: 10px;
`;
const InputTextField = styled.input`
  border: 0;
  outline-width: 0;
  height: 6vh;
  width: 100%;
  padding: 0 15px;
  margin: 0 15px;
  border-radius: 5px;
`;
