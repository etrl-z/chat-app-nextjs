import React from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Sidebar() {
  const [user] = useAuthState(auth);

  const createChat = () => {
    const input = prompt("Insert an e-Mail address!");

    if (!input) return null;

    if (EmailValidator.validate(input)) {
      //add chat into DB collection
      const chatsRef = collection(db, "chats");

      setDoc(doc(chatsRef), {
        users: [user.email, input],
      });
    }
  };

  return (
    <Container>
      <Header>
        <UsrAvatar />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search for chats..." />
      </Search>
      <SearchButton onClick={createChat}>START NEW CHAT</SearchButton>

      <Contacts>{/* List of chats */}</Contacts>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;
const SearchInput = styled.input`
  border: 0;
  outline-width: 0;
  height: 30px;
  width: 100%;
`;
const SearchButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 2px solid whitesmoke;
    border-bottom: 2px solid whitesmoke;
  }
`;
const Contacts = styled.div``;
