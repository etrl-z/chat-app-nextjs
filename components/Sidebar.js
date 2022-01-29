import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, query, where } from "firebase/firestore";
import { useRouter } from "next/router";

import Chat from "../components/Chat.js";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const chatsRef = collection(db, "chats");
  const [chatsSnapshot] = useCollection(
    query(chatsRef, where("users", "array-contains", user.email))
  );

  const createChat = () => {
    const input = prompt("Insert an e-Mail address!");

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //add chat into DB collection
      setDoc(doc(chatsRef), {
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    //router.push(router.pathname.split('/')[0]);
  }

  return (
    <Container>
      <Header>
        <UsrAvatar src={user.photoURL} onClick={signOut} />
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

      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
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
  padding: 0 10px;
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
