import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { doc, deleteDoc, collection, query, where } from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail.js";
import { device } from '../utils/deviceBreakpoints.js';

export default function Chat({ id, users }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const router = useRouter();
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const deleteChat = () => {
    deleteDoc(doc(db, "chats", id));
    router.push(`/`);
  };

  return (
    <Container>
      <ChatInfo onClick={enterChat}>
        <UserAvatar src={recipient ? recipient.photoURL : ""}>
          {!recipient ? recipientEmail[0].toUpperCase() : ""}
        </UserAvatar>
        <p>{recipient ? recipient.name.length ? recipient.name : recipient.name : recipientEmail}</p>
      </ChatInfo>
      <ChatDelete>
        <IconButton onClick={deleteChat}>
          <DeleteIcon className="delete" />
        </IconButton>
      </ChatDelete>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }

  :hover .delete {
    color: #ea5c5e;
  }

  > p {
    min-width: 50px;
  }
`;
const ChatInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
const ChatDelete = styled.div``;
const UserAvatar = styled(Avatar)`
  margin-right: 15px;
`;
const DeleteIcon = styled(Delete)`
  color: white;
`;
