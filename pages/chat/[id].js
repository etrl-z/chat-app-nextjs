import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar.js";
import ChatScreen from "../../components/ChatScreen";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import getRecipientEmail from "../../utils/getRecipientEmail.js";

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  const chatEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Head>
        <title>Chat with {chatEmail}</title>
      </Head>

      <Sidebar />

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const chatById = doc(db, `chats/${context.query.id}`);

  //Retrieve Chats
  const chatRes = await getDoc(chatById);
  const chat = {
    id: chatRes.id,
    users: chatRes.data().users,
  };

  //Retrieve Messages
  const messagesRes = await getDocs(collection(chatById, "messages"));
  const messages = messagesRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      chat: chat,
      messages: JSON.stringify(messages),
    },
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
`;
