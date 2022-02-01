import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar.js";
import ChatScreen from "../../components/ChatScreen";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import getRecipientEmail from "../../utils/getRecipientEmail.js";

export default function Chat() {

  const router = useRouter();
  const [user] = useAuthState(auth);
  const [chatsSnapshot] = useCollection(
    query(collection(db, "chats"), where("users", "array-contains", user.email))
  );
  const chatSnap = chatsSnapshot?.docs.find((chat) => chat.id == router.query.id);
  const chatEmail = getRecipientEmail(chatSnap?.data().users, user);

  return (
    <Container>
      <Head>
        <title>Chat with {chatEmail}</title>
      </Head>

      <Sidebar />

      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
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
