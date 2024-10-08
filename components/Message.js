import styled from "styled-components";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Message({ user, text, sentAtTime }) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfBody = user === userLoggedIn.email ? Sent : Received;

  return (
    <Container>
      <TypeOfBody>
        {text}
        <Timestamp>
          {sentAtTime ? moment(sentAtTime).format("LT") : "..."}
        </Timestamp>
      </TypeOfBody>
    </Container>
  );
}

const Container = styled.div``;
const MessageBody = styled.p`
  padding: 15px 20px;
  border-radius: 10px;
  margin: 15px 0 0;
  width: fit-content;
  max-width: 60%;
  min-width: 50px;
  word-break: break-word;
`;
const Timestamp = styled.p`
  color: grey;
  font-size: 12px;
  text-align: right;
  margin: 10px 0 0;
`;
const Sent = styled(MessageBody)`
  background-color: #deedf5;
  margin-left: auto;
`;
const Received = styled(MessageBody)`
  background-color: whitesmoke;
`;
