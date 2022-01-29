import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar.js";
import ChatScreen from "../../components/ChatScreen";
import { db } from "../../firebase.js";
import { collection } from "firebase/firestore";

export default function Chat() {
  return (
    <Container>
      <Head>
        <title>Chat with {}</title>
      </Head>

      <Sidebar />

      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const chatsRef = collection(db, "chat");

  return {
    props: {},
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
`;
