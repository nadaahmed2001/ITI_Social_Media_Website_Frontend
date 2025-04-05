import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import axios from "axios";

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
            // Send message to the chatbot endpoint with the correct body format
            const response = await axios.post(
                "http://127.0.0.1:8000/api/chat/chatbot/",
                { message: newMessage },
                {
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTU1NTk5LCJpYXQiOjE3NDM4NjkxOTksImp0aSI6ImI3Yzg3Nzg5MTYwNjQzYzY4YTU4NTJjODE3YmQ4NTZlIiwidXNlcl9pZCI6NH0.Is4z_RTUA6L4qYgdDlgwvaNYiBM4832gjdAPf1gN2fo", // Replace with a valid token
                    },
                }
            );

            // Add AI response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "AI", content: response.data.response }, // Use the correct property for AI response
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
