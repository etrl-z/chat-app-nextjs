import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where } from "firebase/firestore";
import Chat from "../components/Chat.js";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [chatsSnapshot] = useCollection(
    query(collection(db, "chats"), where("users", "array-contains", user.email))
  );

  const [input, setInput] = useState();

  async function createChat(e) {
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //add chat into DB collection
      const docRef = await addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
      //reset input & open chat
      setInput("");
      router.push(`/chat/${docRef.id}`);
    }
  }

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  const router = useRouter();
  const navigateHome = () => {
    router.push(`/`);
  };

  const signOut = () => {
    router.push(`/`);
    auth.signOut();
  };

  return (
    <Container>
      <Header>
        <HeaderInfo>
          <UsrAvatar src={user.photoURL} onClick={signOut} />
          <h3>Hello, {user.displayName.split(" ")[0]}!</h3>
        </HeaderInfo>
        <IconsContainer>
          <IconButton>
            <ChatIcon onClick={navigateHome} />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <ControlsPanel>
        <Search>
          <AddIcon />
          <SearchInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Insert a valid e-mail address..."
          />
        </Search>
        <CreateButton onClick={createChat}>START NEW CHAT</CreateButton>
      </ControlsPanel>

      <ChatsContainer>
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </ChatsContainer>
    </Container>
  );
}

const Container = styled.div`
  flex: 30%;
  min-width: 300px;
  max-width: 500px;
  border-right: 2px solid whitesmoke;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; //IE, Edge
  scrollbar-width: none; //Firefox
`;
const Header = styled.div`
  position: sticky;
  height: 80px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 2px solid whitesmoke;
  background-color: white;
  z-index: 1;
`;
const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UsrAvatar = styled(Avatar)`
  cursor: pointer;
  margin-right: 15px;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const ControlsPanel = styled.div`
  position: sticky;
  top: 80px;
  background-color: white;
  z-index: 1;
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
`;
const SearchInput = styled.input`
  border: 0;
  outline-width: 0;
  height: 50px;
  width: 100%;
  margin-left: 10px;
`;
const CreateButton = styled(Button)`
  width: 100%;
  height: 50px;
  &&& {
    border-top: 2px solid whitesmoke;
    border-bottom: 2px solid whitesmoke;
  }
`;
const ChatsContainer = styled.div``;