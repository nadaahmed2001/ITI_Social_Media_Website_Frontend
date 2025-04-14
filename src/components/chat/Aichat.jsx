import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import api from "../services/api";

export default function Aichat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) {
            alert("Message cannot be empty.");
            return;
        }

        // Add user message to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "You", content: newMessage },
        ]);

        try {
            const token = localStorage.getItem("access_token"); 

            const response = await api.post(
                "http://127.0.0.1:8000/api/chat/chatbot/",
                { message: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "AI", content: response.data.response },
            ]);
        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            alert("Failed to get a response from the chatbot.");
        }

        setNewMessage(""); // Clear input field
    };

    return (
        <div className="flex w-full h-screen overflow-hidden ">
            <div className="mt-[112px] ml-28 mr-10">
                <ChatSidebar />
            </div>
            <div className="flex-1 flex flex-col bg-black text-[#7a2226]  background-div">
                <h2 className="text-xl font-bold mb-4 text-center">AI Chat</h2>
                <div className="flex-1 overflow-y-auto mb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded ${
                                msg.sender === "You"
                                    ? "bg-[#7a2226] text-black self-end"
                                    : "bg-gray-800 text-[#7a2226] self-start"
                            }`}
                        >
                            <strong>{msg.sender}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage}  className="p-4 border-t flex items-center gap-2 backdrop-blur-sm bg-gray-800">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border-none outline-none px-4 py-2 rounded-lg  text-[#7a2226] placeholder-white focus:ring-2 focus:ring-[#7a2226] transition-all duration-200 bg-[rgba(199,199,199,0.591)]"
                    />
                    <button
                        type="submit"
                        className=" text-[#7a2226] bg-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
