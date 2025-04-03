import React, { useEffect, useState, useRef } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, fetchUser } from "../../services/api";
import { useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MessagesList.css';

const MessagesList = ({ isGroupChat }) => {
    const { id } = useParams(); // `id` is the group_id or user_id depending on the chat type
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null); // WebSocket reference
    const nodeRefs = useRef({}); // Store refs for each message

    // Temporary hardcoded token
    const token = "eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNzUyOTY5LCJpYXQiOjE3NDM2NjY1NjksImp0aSI6IjA0Y2Y2NGI4NjlkYjQyMDU4NmY3MTI5MzRhMTliMDNmIiwidXNlcl9pZCI6NH0eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNzUyOTY5LCJpYXQiOjE3NDM2NjY1NjksImp0aSI6IjA0Y2Y2NGI4NjlkYjQyMDU4NmY3MTI5MzRhMTliMDNmIiwidXNlcl9pZCI6NH0.fDI59aVVz6nrkH8iHY0xNNiqU-d2uSc1X0UZPaBtf4s";

    // Function to connect to the WebSocket
    const connect_to_group_chat = () => {
        const socketUrl = isGroupChat
            ? `ws://127.0.0.1:8000/ws/chat/group/${id}/?token=${token}` // Group chat WebSocket URL
            : `ws://127.0.0.1:8000/ws/chat/private/${id}/?token=${token}`; // Private chat WebSocket URL

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };
        
        socketRef.current.onmessage = (event) => {
            console.log("Message received:", event.data);
        };
        
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        
        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };
        // Handle WebSocket connection open
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
        };

        // Listen for messages from the WebSocket server
        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "chat_message") {
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        // Handle WebSocket errors
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Handle WebSocket connection close
        socketRef.current.onclose = (event) => {
            console.log("WebSocket connection closed:", event.reason);
        };
    };

    useEffect(() => {
        // Fetch the current user's username
        const fetchCurrentUser = async () => {
            try {
                const response = await fetchUser();
                setCurrentUser(response.data.username);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                const response = isGroupChat
                    ? await fetchGroupMessages(id) // Fetch group messages
                    : await fetchPrivateMessages(id); // Fetch private messages
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Connect to WebSocket
        connect_to_group_chat();

        return () => {
            // Clean up WebSocket connection
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [id, isGroupChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messageData = {
                content: newMessage,
                sender: currentUser,
                chatId: id,
                timestamp: new Date().toISOString(),
            };

            // Send the message via WebSocket
            socketRef.current.send(JSON.stringify({
                type: "chat_message",
                message: messageData,
            }));

            // Optimistically update the UI
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage("");
        } else {
            console.error("WebSocket is not connected");
        }
    };

    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <div className="flex-1 flex flex-col bg-black text-yellow-400">
                <div className="flex-1 overflow-y-auto p-4">
                    <TransitionGroup>
                        {messages.map((message, index) => {
                            if (!nodeRefs.current[index]) {
                                nodeRefs.current[index] = React.createRef();
                            }

                            return (
                                <CSSTransition
                                    key={index}
                                    timeout={300}
                                    classNames="message"
                                    nodeRef={nodeRefs.current[index]}
                                >
                                    <div
                                        ref={nodeRefs.current[index]}
                                        className={`mb-4 p-3 rounded-lg max-w-fit ${
                                            message.sender.username === currentUser
                                                ? "bg-gray-700 text-right"
                                                : "bg-gray-800 text-left self-start"
                                        }`}
                                    >
                                        <strong>{message.sender.username === currentUser ? "Me" : message.sender.username}:</strong> {message.content}
                                        <div className="text-sm text-gray-500">
                                            {new Date(message.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="border p-2 w-full bg-gray-800 text-yellow-400 rounded-lg"
                    />
                    <button type="submit" className="bg-yellow-500 text-black px-4 py-2 mt-2 rounded-lg">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessagesList;