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
  const [currentColor, setCurrentColor] = useState("#FF5C8E");
  const [themeSettings, setThemeSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [showMainContainer, setShowMainContainer] = useState(false);
  const [typing, setTyping] = useState(false);

  const getSystemTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "Dark";
    } else {
      return "Light";
    }
  };

  const [currentMode, setCurrentMode] = useState(getSystemTheme);

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

  const handleClose = (e, closeFunction) => {
    if (e.target.classList.contains("bg-half-transparent")) {
      closeFunction(false);
    }
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
        handleClose,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
