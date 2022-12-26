// if you call the same useFunction from functions in different places
// there isnt any connection between them
// use react Context instead!!!

import { useState, useEffect, createContext, useContext } from "react";
import { message } from "antd";
const client = new WebSocket("ws://localhost:4000");
client.onopen = () => console.log("backend socket server connected");
const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
//define context
const ChatContext = createContext({
  status: {},
  me: "",
  signedIn: false,
  messages: [],
  startChat: () => {},
  sendMessage: () => {},
  clearMessages: () => {},
});

//define context provider
const ChatProvider = (props) => {
  const [status, setStatus] = useState({});
  const [me, setMe] = useState(savedMe || "");
  const [messages, setMessages] = useState([]);
  const [signedIn, setSignedIn] = useState(false);

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s;
      const content = { content: msg, duration: 0.5 };
      switch (type) {
        case "success":
          message.success(content);
          break;
        //case "error":
        default:
          message.error(content);
          break;
      }
    }
  };

  client.onmessage = (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data);
    switch (task) {
      case "CHAT":
        console.log(payload);
        setMessages(payload);
        break;
      case "MESSAGE": {
        console.log(payload, "djfklskjf");
        setMessages(() => [...messages, payload]);
        break;
      }
      /*case "output":
        setMessages(() => [...messages, ...payload]);
        break;

      case "status":
        setStatus(payload);
        break;

      case "init":
        setMessages(payload);
        break;
      case "cleared":
        //setMessages([]);
        break;
*/
      default:
        break;
    }
  };
  const sendData = async (data) => {
    await client.send(JSON.stringify(data));
    //JSON.stringify() converting object to string
    //JSON.parse(str[,reviver]) converting string to object
  };
  const startChat = (name, to) => {
    if (!name || !to) throw new Error("Name or to required");
    console.log("startchat");
    sendData({ type: "CHAT", payload: { name, to } });
  };

  const sendMessage = (name, to, body) => {
    //setMessage!!!
    if (!name || !to || !body) throw new Error("Name, to or body required");
    console.log(body, name, to);
    sendData({ type: "MESSAGE", payload: { name, to, body } });

    //setMessages([...messages, msg]);
    //setStatus({ type: "success", msg: "Message sent" });
    //console.log(msg);
  };
  const clearMessages = (name, to) => {
    sendData({ type: "CLEAR", payload: { name, to } });
  };

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [me, signedIn]);

  return (
    <ChatContext.Provider
      value={{
        status,
        me,
        signedIn,
        messages,
        setMe,
        setSignedIn,
        sendMessage,
        clearMessages,
        displayStatus,
        startChat,
      }}
      {...props}
    />
  );
};
const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat };
