import { Input, Tabs } from "antd";
import styled from "styled-components";
import { useChat } from "./hooks/useChat";
import AppTitle from "../components/Title";
import Message from "../components/Message";
import ChatModal from "../components/ChatModal";
import { useEffect, useRef, useState } from "react";
const ChatBoxesWrapper = styled(Tabs)`
  width: 100%;
  height: 300px;
  background: #eeeeee52;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
`;
const ChatBoxWrapper = styled.div`
  height: 204px;
  overflow: auto;
  flex-direction: column;
  display: flex;
`;
//defined a div for scroll to get reference
const FootRef = styled.div`
  height: 20px;
`;
const ChatRoom = () => {
  const { messages, me, displayStatus, sendMessage, startChat } = useChat();
  const [body, setBody] = useState(""); //remember use [] for useState()
  const [msgSent, setMsgSent] = useState(false); //make sure sent the new msg
  const bodyRef = useRef(null); //bodyRef is for changing select from name to msg
  const msgFooter = useRef(null); //msgFooter is to get the referance that need to be scroll to
  const [chatBoxes, setChatBoxes] = useState([]); //{label,children,key}
  const [activeKey, setActiveKey] = useState(""); //change to the page you choose
  const [modalOpen, setModalOpen] = useState(false);

  const addChatBox = (friend) => {
    if (chatBoxes.some(({ key }) => key === friend)) {
      throw new Error(friend + "'s chat box has already opened.");
    }

    const chat = renderChat();
    setChatBoxes(() => [
      ...chatBoxes,
      { label: friend, children: chat, key: friend },
    ]);
    startChat(me, friend);
    setActiveKey(friend);
    setMsgSent(true);
    return friend;
  };

  const removeChatBox = (targetKey) => {
    const index = chatBoxes.findIndex(({ key }) => key === activeKey);
    const newChatBoxes = chatBoxes.filter((item) => item.key !== targetKey);

    if (activeKey) {
      if (activeKey === targetKey) {
        if (index === 0) {
          setActiveKey("");
        } else setActiveKey(chatBoxes[index - 1].key);
      }
    } else setActiveKey("");
    if (activeKey) {
      startChat(me, activeKey);
    }
    setChatBoxes(newChatBoxes);
  };
  const renderChat = () => {
    return (
      <ChatBoxWrapper>
        {messages.length === 0 ? (
          <p style={{ color: "#ccc" }}>No messages...</p>
        ) : (
          messages.map((msg, i) => (
            <Message key={i} isMe={msg.name === me} message={msg.body} />
          ))
        )}
        <FootRef ref={msgFooter} />
      </ChatBoxWrapper>
    );
  }; // 產⽣ chat 的 DOM nodes

  const scrollToBottom = () => {
    //ref像一個pointer.current就是拿到物件
    //?. if front is undefined=> return undefined
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    scrollToBottom();
    setMsgSent(false);
  }, [msgSent]); //msgSent,

  useEffect(() => {
    const chat = renderChat();
    const a = chatBoxes.findIndex((element) => element.label === activeKey);
    if (a === -1) return;
    let b = [
      ...chatBoxes.slice(0, a),
      { label: activeKey, children: chat, key: activeKey },
      ...chatBoxes.slice(a + 1),
    ];
    setChatBoxes(b);
    setMsgSent(true);
  }, [messages]);

  return (
    <>
      <AppTitle name={me} />
      <>
        <ChatBoxesWrapper
          type="editable-card"
          onChange={(key) => {
            setActiveKey(key);
            startChat(me, key);
            //setModalOpen(false);
          }}
          activeKey={activeKey}
          onEdit={(targetKey, action) => {
            if (action === "add") setModalOpen(true); //addChatBox();
            else removeChatBox(targetKey);
          }}
          items={chatBoxes}
        />
        <ChatModal
          open={modalOpen}
          onCreate={({ name }) => {
            addChatBox(name);
            // extractChat(name);
            setModalOpen(false);
          }}
          onCancel={() => setModalOpen(false)}
        />
      </>
      <Input.Search
        ref={bodyRef}
        enterButton="Send"
        //show in box
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message here..."
        //when send call sendMessage
        onSearch={(msg) => {
          if (!msg) {
            displayStatus({
              type: "error",
              msg: "Please enter a message body.",
            });
            return;
          }
          sendMessage(me, activeKey, msg);
          setBody("");
          //trigger scroll
          setMsgSent(true);
        }}
      ></Input.Search>
    </>
  );
};
export default ChatRoom;
