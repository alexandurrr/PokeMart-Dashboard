import React, { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  Avatar,
  ChatContainer,
  MainContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import ashbot from "../data/ashbot.jpg";
import avatar from "../data/avatar.jpg";

const Chatbot = () => {
  const {
    messages,
    setMessages,
    typing,
    setTyping,
    currentColor,
    showMainContainer,
    setShowMainContainer,
    knowledgeBase,
    setKnowledgeBase,
  } = useStateContext();

  const API_KEY = "YOUR_API_KEY_HERE";

  /*   useEffect(() => {
    fetch("/knowledgebase.txt")
      .then((response) => response.text())
      .then((text) => {
        setKnowledgeBase(text);
      })
      .catch((error) => console.error("Error loading knowledge base:", error));
  }, []); */

  const systemMessage = {
    role: "system",
    content:
      "Explain all concepts as Ash Ketchum. You are an assistant helping users checkout wares and the different functionalities of an online Poke Mart website. Be precise and don't write too much text. Here is some additional knowledge base: " +
      "",
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };
  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-4o",
      messages: [systemMessage, ...apiMessages],
      temperature: 1,
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
      <div className="float-right h-screen dark:text-gray-200 bg-white dark:bg-[#484B52] w-400">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-xl">Chatbot - Ash Ketchum</p>
          <button
            type="button"
            onClick={() => setShowMainContainer(false)}
            style={{
              color: currentColor,
              borderRadius: "50%",
            }}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>
        </div>
        <MainContainer
          style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
        >
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => (
                <Message key={i} model={message}>
                  {message.sender === "ChatGPT" ? (
                    <Avatar name="Ash Ketchum" src={ashbot} />
                  ) : (
                    <Avatar name="User" src={avatar} />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default Chatbot;
