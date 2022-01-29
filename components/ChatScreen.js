import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Message from "./Message.js";

export default function ChatScreen() {
  const messages = [
    "Hello to the friends from all the world!",
    "Danke Bitte!",
    "Hola Amigos de todo lo mundo!",
    "Se nì mondo esistesse un pò di bene e ognun si considerasse suo fratello ci sarebbero meno pensieri e meno pene ed il mondo ne sarebbe assai più bello."
  ];

  return (
    <Container>
      <Header>
        <UsrAvatar />
        <HeaderInfo>
          <h3>User Name</h3>
          <p>Last seen...</p>
        </HeaderInfo>
        <IconsContainer>
          <IconButton>
            <AttachFileIcon />
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
const IconsContainer = styled.div``;
const MessageContainer = styled.div`
  background-color: #e4ded9;
  width: 100%;
  min-height: 80vh;
  padding: 30px;
`;
