import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, fetchUser, 
    sendGroupMessage, sendPrivateMessage, editMessage, deleteMessage,
    clearGroupMessages, clearPrivateMessages ,editGroupChat } from "../../components/services/api";
import { useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MessagesList.css';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';



const MessagesList = ({token, isGroupChat }) => {
    // console.log( )
    const { id } = useParams(); // id is the group_id or user_id depending on the chat type
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null); // WebSocket reference
    const reconnectAttempts = useRef(0); // Track reconnection attempts
    const nodeRefs = useRef({}); // Store refs for each message
    token = localStorage.getItem("access_token"); 
    // Temporary hardcoded token
    //  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTY4NjU4LCJpYXQiOjE3NDM4ODIyNTgsImp0aSI6IjNmZDEzN2RhMTVkNTRjZGE5ZTM3MGY2YjAxMTRmNmE3IiwidXNlcl9pZCI6NH0.attP3etscne7JkqU2zPSv-4t5VVpXeFiZum69LM90BY";
    if (!token) {
        console.error("No token passed to MessagesList component!");
    }
    
    // Add state to store WebSocket configuration
    const [wsConfig, setWsConfig] = useState(null);
    
    // Function to fetch WebSocket configuration from the API
    const fetchWebSocketConfig = useCallback(async () => {
        try {
            // Determine the base URL for API calls
            const baseUrl = "https://itisocialmediawebsitebackend-production.up.railway.app/"
            const response = await fetch(`${baseUrl}api/websocket-config/`);
            if (!response.ok) {
                throw new Error(`Failed to fetch WebSocket config: ${response.status}`);
            }
            
            const config = await response.json();
            console.log("WebSocket configuration received:", config);
            setWsConfig(config);
            return config;
        } catch (error) {
            console.error("Error fetching WebSocket config:", error);
            return null;
        }
    }, []);
    
    // Memoize the WebSocket connection function
    const connect_to_group_chat = useCallback(async () => {
        try {
            // Try to get the configuration from API first
            const config = wsConfig || await fetchWebSocketConfig();
            
            const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            
            // Determine WebSocket host from API response or fallback to auto-detection
            let wsHost;
            
            if (config && config.wsHost) {
                wsHost = config.wsHost;
                console.log('Using API-provided WebSocket host:', wsHost);
            } else {
                // Fallback to auto-detection
                const isProduction = !window.location.hostname.includes('localhost') && 
                                    window.location.hostname !== '127.0.0.1';
                
                wsHost = isProduction ? window.location.host : 'localhost:8000';
                console.log('Using auto-detected WebSocket host:', wsHost);
            }
            
            // Add special handling for Railway deployment Redis issues
            const isRailwayDeployment = wsHost.includes('railway.app');
            if (isRailwayDeployment) {
                console.log('Railway deployment detected, taking extra precautions for WebSocket connection');
            }
            
            const socketUrl = isGroupChat
                ? `${wsProtocol}//${wsHost}/ws/chat/group/${id}/?token=${token}`
                : `${wsProtocol}//${wsHost}/ws/chat/private/${id}/?token=${token}`;
            
            console.log(`Attempting WebSocket connection to: ${socketUrl}`);
            
            // Close existing connection if it exists
            if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
                socketRef.current.close();
            }

            // Set a connection timeout
            const connectionTimeoutMs = 5000; // 5 seconds
            const connectionTimeout = setTimeout(() => {
                console.error(`WebSocket connection timed out after ${connectionTimeoutMs}ms`);
                if (socketRef.current && socketRef.current.readyState === WebSocket.CONNECTING) {
                    socketRef.current.close();
                }
            }, connectionTimeoutMs);

            socketRef.current = new WebSocket(socketUrl);
            
            socketRef.current.onopen = () => {
                clearTimeout(connectionTimeout); // Clear the timeout when connected
                console.log("WebSocket connection established successfully.");
                // Reset reconnection attempts on successful connection
                reconnectAttempts.current = 0;
            };
            
            socketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "chat_message") {
                        // ...existing code for handling chat messages...
                        const normalizedMessage = {
                            id: data.message.id || Date.now(),
                            content: isGroupChat ? data.message.content : data.message.message,
                            timestamp: data.message.timestamp,
                            sender: data.message.sender,
                            receiver: isGroupChat ? undefined : data.message.receiver,
                        };

                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages, normalizedMessage];
                            return updatedMessages.sort(
                                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                            );
                        });
                    } else if (data.type === "edit_message") {
                        // ...existing code for handling message edits...
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === data.message.id
                                    ? { ...msg, content: data.message.content }
                                    : msg
                            )
                        );
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            const maxReconnectAttempts = 10;
            
            socketRef.current.onclose = (event) => {
                console.log(`WebSocket connection closed (code: ${event.code}). Reconnecting...`);
                
                // Implement exponential backoff for reconnection
                const reconnectDelay = Math.min(1000 * (2 ** reconnectAttempts.current), 30000);
                reconnectAttempts.current += 1;
                
                if (reconnectAttempts.current <= maxReconnectAttempts) {
                    console.log(`Attempting to reconnect in ${reconnectDelay/1000} seconds...`);
                    setTimeout(() => connect_to_group_chat(), reconnectDelay);
                } else {
                    console.error("Max reconnection attempts reached. Please refresh the page.");
                }
            };
        } catch (error) {
            console.error("Failed to establish WebSocket connection:", error);
            // Fallback to polling if WebSockets fail consistently
            if (reconnectAttempts.current >= 3) {
                console.log("WebSocket connection failed multiple times, falling back to polling.");
                // Implement polling logic here if needed
            }
        }
    }, [id, isGroupChat, token, wsConfig, fetchWebSocketConfig]);

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
                        return {
                            id: message.id,
                            content: message.content,
                            timestamp: message.timestamp,
                            sender: message.sender,
                        };
                    } else {
                        return {
                            id: message.id,
                            content: message.message,
                            timestamp: message.timestamp,
                            sender: message.sender,
                            receiver: message.receiver,
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
        // Re-render every second to ensure new messages are displayed
        const interval = setInterval(() => {
            setMessages((prevMessages) => [...prevMessages]); // Trigger re-render
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Alternatively, useEffect to update when a new message is added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the bottom
        }
    }, [messages]);

    useEffect(() => {
        const fetchNewMessages = async () => {
            try {
                const response = isGroupChat
                    ? await fetchGroupMessages(id) // Fetch group messages
                    : await fetchPrivateMessages(id); // Fetch private messages

                const normalizedMessages = response.data.map((message) => {
                    if (isGroupChat) {
                        return {
                            id: message.id,
                            content: message.content,
                            timestamp: message.timestamp,
                            sender: message.sender,
                        };
                    } else {
                        return {
                            id: message.id,
                            content: message.message,
                            timestamp: message.timestamp,
                            sender: message.sender,
                            receiver: message.receiver,
                        };
                    }
                });

                const sortedMessages = normalizedMessages.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );

                setMessages(sortedMessages); // Update messages in state
            } catch (error) {
                console.error("Error fetching new messages:", error);
            }
        };

        const interval = setInterval(() => {
            fetchNewMessages(); // Fetch new messages periodically
        }, 2000); // Fetch every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [id, isGroupChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Check if the message is empty
        if (!newMessage.trim()) {
            alert("The message is empty"); // Display an alert
            return; // Prevent sending the message
        }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            setIsSending(true); // Set sending state

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
            setIsSending(false); // Reset sending state
        } else {
            console.error("WebSocket is not connected");
        }
    };

    const handleEditMessage = async (messageId, oldContent) => {
        const newContent = prompt("Edit your message:", oldContent); // Prompt user for new content
        if (newContent && newContent.trim() !== "") {
            try {
                if (isGroupChat) {
                    // Use editGroupChat for group messages
                    await editGroupChat(id, messageId, newContent);
                } else {
                    // Use editMessage for private messages
                    await editMessage(messageId, newContent);
                }
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId ? { ...msg, content: newContent } : msg
                    )
                );
            } catch (error) {
                console.error("Error editing message:", error);
                alert("Failed to edit the message. Please try again.");
            }
        } else {
            alert("Message content cannot be empty.");
        }
    };

    const handleDeleteMessage = async (messageId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (confirmDelete) {
            try {
                await deleteMessage(messageId, isGroupChat, id); // Call API to delete the message
                setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
            } catch (error) {
                console.error("Error deleting message:", error);
                alert("Failed to delete the message. Please try again.");
            }
        }
    };

    const handleClearMessages = async () => {
        const confirmClear = window.confirm("Are you sure you want to clear all messages?");
        if (confirmClear) {
            try {
                if (isGroupChat) {
                    await clearGroupMessages(id); // Call API to clear group messages
                } else {
                    await clearPrivateMessages(id); // Call API to clear private messages
                }
                setMessages([]); // Clear messages in the UI
            } catch (error) {
                console.error("Error clearing messages:", error);
                alert("Failed to clear messages. Please try again.");
            }
        }
    };

    return (
        <div className="flex h-screen">
            <div className=" text-white mt-15">
                <ChatSidebar/>
            </div>
            <div className="flex-1 flex flex-col relative background-div mt-[80px]">
                {/* Clear Messages Button */}
                <button
                    onClick={handleClearMessages}
                    className="absolute top-1 right-190 text-gray-900 px-3 py-1 hover:bg-gray-300 rounded-xl shadow-md transition-colors z-10 "
                >
                    Clear All Messages
                </button>
                <div className="flex-1 overflow-y-auto p-4 background-div mt-[100px]">
                    {/* Messages List */}
                    <TransitionGroup className="flex flex-col gap-2 ">
                        {messages.map((message, index) => {
                            if (!nodeRefs.current[index]) {
                                nodeRefs.current[index] = React.createRef();
                            }
                            const isMine = message.sender === currentUser;
                            return (
                                <CSSTransition
                                    key={index}
                                    timeout={300}
                                    classNames="message"
                                    nodeRef={nodeRefs.current[index]}
                                >
                                    <div
                                        ref={nodeRefs.current[index]}
                                        className={`max-w-[80%] sm:max-w-md p-3 rounded-xl shadow-md transition-all duration-300  ${
                                            message.sender === currentUser
                                                ? "ml-auto bg-[#7a2226] text-white text-right"
                                                : "mr-auto bg-gray-800 text-[#7a2226] text-left"
                                        } max-w-full sm:max-w-md z-0`}
                                        onContextMenu={(e) => {
                                            e.preventDefault(); // Prevent default right-click menu
                                            if (message.sender === currentUser) {
                                                const action = window.prompt(
                                                    "Right-click actions:\n1. Edit\n2. Delete\nEnter your choice:"
                                                );
                                                if (action === "1") {
                                                    handleEditMessage(message.id, message.content);
                                                } else if (action === "2") {
                                                    handleDeleteMessage(message.id);
                                                }
                                            } else {
                                                alert("You can only edit or delete your own messages.");
                                            }
                                        }}
                                    >
                                      <div className="font-semibold text-sm bg-transparent">
                                    
                            {isMine ? "Me" : message.sender}
                        </div>
                        <div className="break-words text-sm mt-1 bg-transparent">
                            {message.content}
                        </div>
                        <div className="text-xs text-black mt-2 text-right bg-transparent">
                            {new Date(message.timestamp).toLocaleString()}
                        </div>
                                    </div>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                    <div ref={messagesEndRef} /> 
                </div>
                <form onSubmit={handleSendMessage} 
                className="p-4 border-t flex items-center justify-center gap-2 backdrop-blur-sm sticky bottom-0 z-10">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-none outline-none px-4 py-2 rounded-lg text-gray-900 placeholder-gray-900 focus:ring-2 focus:ring-[#7a2226] transition-all duration-200 bg-white"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center w-10 h-10 text-white bg-[#7a2226] rounded-lg transition-all duration-200 hover:bg-[#5a181b] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSending} // Disable the button while sending
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
};

export default MessagesList;