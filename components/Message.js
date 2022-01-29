import styled from "styled-components";

export default function Message({ text }) {
  return (
    <Container>
      <p>{text}</p>
      <p className="timestamp">{new Date().getHours() + ':' + new Date().getMinutes()}</p>
    </Container>
  );
}

const Container = styled.div`
  background-color: #dcf8c5;
  padding: 15px 20px;
  border-radius: 10px;
  max-width: 30%;
  margin: 10px 0;

  > p {
    margin: 0 0 10px 0;
  }

  > .timestamp {
    margin: 0;
    color: grey;
    font-size: 12px;
    text-align: right;
  }
`;
