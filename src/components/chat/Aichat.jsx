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
        <div className="flex w-full h-screen">
            <ChatSidebar />
            <div className="flex-1 flex flex-col bg-black text-yellow-400 p-4">
                <h2 className="text-xl font-bold mb-4 text-center">AI Chat</h2>
                <div className="flex-1 overflow-y-auto mb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded ${
                                msg.sender === "You"
                                    ? "bg-yellow-500 text-black self-end"
                                    : "bg-gray-800 text-yellow-400 self-start"
                            }`}
                        >
                            <strong>{msg.sender}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded bg-gray-800 text-yellow-400"
                    />
                    <button
                        type="submit"
                        className="ml-2 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
