// src/pages/StartChat.jsx
import React from "react";
import ChatSidebar from "../components/chat/ChatSidebar";

export default function StartChat() {
    const userToken =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    null;

    return (
        <div className=" text-white h-[calc(100vh-80px)]" >
            <ChatSidebar token={userToken} />
        </div>
    );
}
