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

export default function ChatScreen({ chat, messages }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [chatsSnapshot] = useCollection(
    query(collection(db, "chats"), where("users", "array-contains", user.email))
  );
  const chatSnap = chatsSnapshot?.docs.find(
    (chat) => chat.id == router.query.id
  );
  const chatEmail = getRecipientEmail(chat.users, user);
  const chatMessages = collection(db, `chats/${chatSnap?.id}/messages`);

  console.log(messages);
  const showMessages = () => {
    return JSON.parse(messages).map((message) => (
      <Message
        key={message.id}
        user={message.sender}
        text={message.message}
        sentAtTime={message.sentAtTime}
      />
    ));
  };

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

      <MessageContainer>{showMessages()}</MessageContainer>

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
  height: 80px;
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
  height: 550px;
  padding: 30px;
`;
const InputBar = styled.div`
  position: sticky;
  background-color: #f0f2f5;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 10px;
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
