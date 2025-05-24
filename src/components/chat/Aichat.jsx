import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import api from "../services/api";
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';


export default function Aichat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Fetch message history when component mounts
    useEffect(() => {
        fetchMessageHistory();
    }, []);
    
    const fetchMessageHistory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            
            const response = await api.get(
                "http://itihub-backend-ikxqcw-ed0c9f-161-156-161-124.traefik.me/api/chat/chatbot/messages/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (response.data && Array.isArray(response.data)) {
                // First add user messages
                let formattedMessages = [];
                response.data.forEach(msg => {
                    // Add user message
                    formattedMessages.push({
                        sender: "You", 
                        content: msg.message
                    });
                    
                    // Add AI response
                    formattedMessages.push({
                        sender: "AI", 
                        content: msg.response
                    });
                });
                
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Error fetching message history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) {
            alert("Message cannot be empty.");
            return;
        }

        const userMessage = newMessage;
        setNewMessage(""); // Clear input field immediately for better UX
        
        // Add user message to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "You", content: userMessage },
        ]);
        
        // Set sending state to show loading
        setIsSending(true);

        try {
            const token = localStorage.getItem("access_token"); 

            const response = await api.post(
                "http://itihub-backend-ikxqcw-ed0c9f-161-156-161-124.traefik.me/api/chat/chatbot/",
                { message: userMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Add AI response to chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "AI", content: response.data.response },
            ]);
        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            alert("Failed to get a response from the chatbot.");
        } finally {
            // Reset sending state when done (either success or error)
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="text-white">
                <ChatSidebar />
            </div>
            <div className="flex-1 flex flex-col relative background-div">
                {/* <h2 className="text-xl font-bold mb-4 text-center">AI Chat</h2> */}
               
                <div className="flex-1 overflow-y-auto p-4 pb-16 background-div">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <CircularProgress sx={{ color: '#7a2226' }} />
                            <span className="ml-2">Loading message history...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            No previous messages. Start a conversation!
                        </div>
                    ) : (
                        // <TransitionGroup className="flex flex-col gap-2">
                     
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`w-fit max-w-[80%] p-3 rounded-xl shadow-md transition-all duration-300 break-words whitespace-pre-wrap  ${

                                    msg.sender === "You"
                                    
                                    ? "ml-auto bg-[#7a2226] text-white text-right"
                                    : "mr-auto bg-gray-800 text-[#7a2226] text-left"
                            } max-w-full sm:max-w-md z-0`}
                            >
                                
                                <strong>{msg.sender}:</strong> <br></br> {msg.content}
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleSendMessage}  className="p-4 border-t flex items-center justify-center gap-2 backdrop-blur-sm sticky bottom-0 z-10 ">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border-none outline-none px-4 py-2 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-[#7a2226] transition-all duration-200 bg-white"
                        disabled={isSending || isLoading}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center w-10 h-10 text-white bg-[#7a2226] rounded-lg transition-all duration-200 hover:bg-[#5a181b] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSending || isLoading}
                    >
                        {isSending ? (
                            <CircularProgress 
                                size={20} 
                                sx={{ color: 'white' }} 
                            />
                        ) : (
                            <SendIcon className="transition-transform duration-200 hover:scale-110 send-msg-btn" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
