import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function login() {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        {/* <Logo src="https://upload.wikimedia.org/wikipedia/commons/7/75/Whatsapp_logo_svg.png"></Logo> */}
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/8/85/Circle-icons-chat.svg"></Logo>
        <Button onClick={signIn} variant="outlined">
          SIGN IN WITH GOOGLE
        </Button>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 100px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
