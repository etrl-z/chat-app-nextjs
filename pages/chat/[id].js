import Head from 'next/head';
import styled from "styled-components";
import Sidebar from '../../components/Sidebar.js'

export default function Chat() {
  return (
    <Container>
      <Head>
        <title>Chat</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div``;
const ChatContainer = styled.div``;
const ChatScreen = styled.div``;
