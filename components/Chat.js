import styled from "styled-components";
import { Avatar, Icon, IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { doc, deleteDoc, collection, query, where } from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail.js";

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
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <ChatInfo>
          <UserAvatar src={recipient.photoURL}></UserAvatar>
          <p>{recipient.name}</p>
        </ChatInfo>
      ) : (
        <ChatInfo>
          <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
          <p>{recipientEmail}</p>
        </ChatInfo>
      )}
      <IconButton onClick={deleteChat}>
        <DeleteIcon className="delete" />
      </IconButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    word-break: break-word;
  }
`;
const ChatInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UserAvatar = styled(Avatar)`
  margin-right: 15px;
`;
const DeleteIcon = styled(Delete)`
  color: white;
`;
