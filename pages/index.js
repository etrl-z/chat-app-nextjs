import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../components/Sidebar.js";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Chatting App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <ChatScreenPlaceHold>
        {/* <Logo src="https://upload.wikimedia.org/wikipedia/commons/7/75/Whatsapp_logo_svg.png"></Logo> */}
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/8/85/Circle-icons-chat.svg"></Logo>
        <p>Select a contact to start chatting...</p>
      </ChatScreenPlaceHold>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  overflow: hidden;
  height: 100vh;
`;
const ChatScreenPlaceHold = styled.div`
  flex: 70%;
  min-width: 500px;
  max-width: 2500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: whitesmoke;
  > p {
    color: gray;
  }
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin: 0 100px 20px;
`;

/*----------------------------------------------------------------*/

// styled components
// material ui / core
// material ui / icons
// firebase
// email validator
// react-firebase-hooks
// timeago-react
// moment
