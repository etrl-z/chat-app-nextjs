import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar.js";
import ChatScreen from "../../components/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import getRecipientEmail from "../../utils/getRecipientEmail.js";

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(chat.users, user);

  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Head>
        <title>Chat with {recipient ? recipient.name : recipientEmail}</title>
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
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; //IE, Edge
  scrollbar-width: none; //Firefox
`;
const ChatContainer = styled.div`
  flex: 1;
`;
