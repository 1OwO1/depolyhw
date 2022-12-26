import "../App.css";
import { Button, Input, message, Tag } from "antd";
import { useChat, ChatProvider } from "./hooks/useChat";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import SignIn from "./SignIn";
import ChatRoom from "./ChatRoom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 500px;
  margin: auto;
`;
function App() {
  const { status, signedIn, displayStatus } = useChat();

  useEffect(() => {
    displayStatus(status);
  }, [status]);

  return <Wrapper>{signedIn ? <ChatRoom /> : <SignIn />}</Wrapper>;
}

export default App;
