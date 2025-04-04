import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, fetchUser , sendGroupMessage, sendPrivateMessage } from "../../services/api";
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODY3ODg3LCJpYXQiOjE3NDM3ODE0ODcsImp0aSI6ImFlMzNhZmE3MjUwMjQ5MWZiMTQ1ZGJkOTNmNzQwNjZhIiwidXNlcl9pZCI6MX0.G420CoY1QYI-OSWZinE5HUMf5Z50xE2AklJSlMFkRzw";

    // Memoize the WebSocket connection function
    const connect_to_group_chat = useCallback(() => {
        const socketUrl = isGroupChat
            ? `ws://127.0.0.1:8000/ws/chat/group/${id}/?token=${token}` // Group chat WebSocket URL
            : `ws://127.0.0.1:8000/ws/chat/private/${id}/?token=${token}`; // Private chat WebSocket URL

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };
        
        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "chat_message") {
                    const normalizedMessage = {
                        id: data.message.id,
                        content: isGroupChat ? data.message.content : data.message.message, // Normalize content
                        timestamp: data.message.timestamp,
                        sender: data.message.sender,
                        receiver: isGroupChat ? undefined : data.message.receiver, // Include receiver for private messages
                    };

                    // Add the new message and sort by timestamp
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, normalizedMessage];
                        return updatedMessages.sort(
                            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                        );
                    });
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        
        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed. Reconnecting...");
            setTimeout(() => connect_to_group_chat(), 1000); // Reconnect after 1 second
        };
    }, [id, isGroupChat, token]);

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

                // Normalize the response data
                const normalizedMessages = response.data.map((message) => {
                    if (isGroupChat) {
                        // Normalize group chat message structure
                        return {
                            id: message.id,
                            content: message.content, // Use `content` for group messages
                            timestamp: message.timestamp,
                            sender: message.sender,
                        };
                    } else {
                        // Normalize private chat message structure
                        return {
                            id: message.id,
                            content: message.message, // Use `message` for private messages
                            timestamp: message.timestamp,
                            sender: message.sender,
                            receiver: message.receiver, // Include receiver for private messages
                        };
                    }
                });

                // Sort messages by timestamp
                const sortedMessages = normalizedMessages.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );

                setMessages(sortedMessages); // Set sorted messages in state
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
    }, [id, isGroupChat, connect_to_group_chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
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

            // Save the message to the database
            try {
                if (isGroupChat) {
                    await sendGroupMessage(id, newMessage); // Save group message
                } else {
                    await sendPrivateMessage(id, newMessage); // Save private message
                }
            } catch (error) {
                console.error("Error saving message:", error);
            }

            // Optimistically update the UI and sort messages
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, messageData];
                return updatedMessages.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
            });

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
                                            message.sender === currentUser
                                                ? "bg-gray-700 text-right"
                                                : "bg-gray-800 text-left self-start"
                                        }`}
                                    >
                                        <strong>{message.sender === currentUser ? "Me" : message.sender}:</strong> {message.content}
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