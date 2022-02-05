import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
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

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient.photoURL}></UserAvatar>
      ) : (
        <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
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

  > p {
    min-width: 50px;
    word-break: break-word;
  }
`;
const UserAvatar = styled(Avatar)`
  margin-right: 15px;
`;
