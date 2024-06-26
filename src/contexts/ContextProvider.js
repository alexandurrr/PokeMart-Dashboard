import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [showMainContainer, setShowMainContainer] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hey it's Ash! What can I help ya with?",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
    setThemeSettings(false);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
    setThemeSettings(false);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        currentColor,
        currentMode,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        isPlaying,
        togglePlayPause,
        messages,
        setMessages,
        typing,
        setTyping,
        showMainContainer,
        setShowMainContainer,
        knowledgeBase,
        setKnowledgeBase,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
