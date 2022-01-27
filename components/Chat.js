import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import getRecipientEmail from "../utils/getRecipientEmail.js";

export default function Chat({ id, users }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const router = useRouter();
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
      <p>{recipientEmail}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15 px;
  cursor: pointer;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
