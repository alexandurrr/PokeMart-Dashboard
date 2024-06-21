import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown } from "react-icons/fa";

import avatar from "../data/avatar.jpg";
import { Cart, Chat, Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const VolumeSlider = ({ volume, setVolume, color }) => (
  <div className="flex items-center ml-4">
    <FaVolumeDown style={{ color }} />
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      className="ml-2 mr-2"
      style={{ width: "80px", color: color }}
    />
    <FaVolumeUp style={{ color }} />
  </div>
);

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
    isPlaying,
    togglePlayPause,
  } = useStateContext();

  const [volume, setVolume] = useState(0.5); // Initial volume

  const audioRef = useRef(new Audio("/backgroundsong.mp3"));

  useEffect(() => {
    audioRef.current.volume = volume; // Update volume when volume state changes
  }, [volume]);

  useEffect(() => {
    audioRef.current.addEventListener("ended", () => togglePlayPause());
    return () => {
      audioRef.current.removeEventListener("ended", () => togglePlayPause());
    };
  }, [togglePlayPause]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between items-center p-2 md:mx-6 relative">
      <div className="flex items-center">
        <NavButton
          title="Menu"
          customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
          color={currentColor}
          icon={<AiOutlineMenu />}
        />
        <NavButton
          title="Search"
          customFunc={() => onClick(() => {})}
          color={currentColor}
          icon={<AiOutlineSearch />}
        />
        <NavButton
          title={isPlaying ? "Pause" : "Play"}
          customFunc={togglePlayPause}
          color={currentColor}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
        />
        {isPlaying && (
          <VolumeSlider
            volume={volume}
            setVolume={setVolume}
            color={currentColor}
          />
        )}
      </div>

      <div className="flex">
        <NavButton
          title="Cart"
          customFunc={() => handleClick("cart")}
          color={currentColor}
          icon={<FiShoppingCart />}
        />
        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={() => handleClick("chat")}
          color={currentColor}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notifications"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notification")}
          color={currentColor}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className=" flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="User avatar"
            />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">Alex</span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
