// src/pages/StartChat.jsx
import React from "react";
import ChatSidebar from "../components/chat/ChatSidebar";

export default function StartChat() {
    const userToken =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    null;

    return (
        <div className="bg-[#181819] text-white mt-28 ml-28">
            <ChatSidebar token={userToken} />
        </div>
    );
}
