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
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const nodeRefs = useRef({});
    const reconnectAttempts = useRef(0);

    token = localStorage.getItem("access_token"); 
    if (!token) {
        console.error("No token passed to MessagesList component!");
    }

    // Robust WebSocket connection with reconnection logic
    const connect_to_group_chat = useCallback(() => {
        // Move WS_BASE_URL inside the callback to avoid dependency issues
        const WS_BASE_URL = window.location.protocol === 'https:' 
            ? `wss://itihub-backend-ikxqcw-ed0c9f-161-156-161-124.traefik.me` 
            : `ws://itihub-backend-ikxqcw-ed0c9f-161-156-161-124.traefik.me`;
            
        // Create appropriate WebSocket URL based on chat type
        const socketUrl = isGroupChat
            ? `${WS_BASE_URL}/ws/chat/group/${id}/?token=${token}`
            : `${WS_BASE_URL}/ws/chat/private/${id}/?token=${token}`;

        console.log(`Connecting to WebSocket: ${socketUrl}`);

        // Close existing connection if any
        if (socketRef.current && socketRef.current.readyState < 2) {
            socketRef.current.close();
        }

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
            setIsConnected(true);
            reconnectAttempts.current = 0;
            setConnectionError(false);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Handle message from backend (Django Channels typical format)
                if (data.type === "chat_message") {
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
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === data.message.id
                                ? { ...msg, content: data.message.content }
                                : msg
                        )
                    );
                } else if (data.type === "delete_message") {
                    setMessages((prevMessages) =>
                        prevMessages.filter((msg) => msg.id !== data.message_id)
                    );
                } else if (data.type === "clear_chat") {
                    setMessages([]);
                } else if (data.error) {
                    console.error("WebSocket error:", data.error);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error, event.data);
            }
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error on URL:", socketUrl, error);
            setIsConnected(false);
        };

        socketRef.current.onclose = (event) => {
            console.log(`WebSocket connection closed with code: ${event.code}`);
            setIsConnected(false);
            if (event.code !== 1000 && event.code !== 1001) {
                const backoffTime = (reconnectAttempts.current * 1000) + Math.random() * 1000;
                const maxBackoff = 30000;
                setTimeout(() => {
                    if (reconnectAttempts.current < 10) {
                        console.log(`Attempting to reconnect (${reconnectAttempts.current + 1})...`);
                        reconnectAttempts.current += 1;
                        connect_to_group_chat();
                    } else {
                        console.error("Maximum reconnection attempts reached.");
                        setConnectionError(true);
                    }
                }, Math.min(backoffTime, maxBackoff));
            }
        };
    }, [id, isGroupChat, token]);

    // Utility functions for WebSocket actions
    const wsSendMessage = (messageContent) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        const payload = {
            action: "send",
            message: messageContent,
            timestamp: new Date().toISOString(),
        };
        socketRef.current.send(JSON.stringify(payload));
    };

    const wsEditMessage = (messageId, newContent) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        const payload = {
            action: "edit",
            message_id: messageId,
            new_content: newContent
        };
        socketRef.current.send(JSON.stringify(payload));
    };

    const wsDeleteMessage = (messageId) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        const payload = {
            action: "delete",
            message_id: messageId
        };
        socketRef.current.send(JSON.stringify(payload));
    };

    const wsClearChat = () => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        const payload = {
            action: "clear"
        };
        socketRef.current.send(JSON.stringify(payload));
    };

    useEffect(() => {
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
        const fetchMessages = async () => {
            try {
                const response = isGroupChat
                    ? await fetchGroupMessages(id)
                    : await fetchPrivateMessages(id);
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
                setMessages(sortedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
        connect_to_group_chat();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [id, isGroupChat, connect_to_group_chat]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (!newMessage.trim()) {
    //         alert("The message is empty");
    //         return;
    //     }
    //     setIsSending(true);
    //     wsSendMessage(newMessage);
    //     try {
    //         if (isGroupChat) {
    //             await sendGroupMessage(id, newMessage);
    //         } else {
    //             await sendPrivateMessage(id, newMessage);
    //         }
    //     } catch (error) {
    //         console.error("Error saving message:", error);
    //     }
    //     setNewMessage("");
    //     setIsSending(false);
    // };

    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (!newMessage.trim()) {
    //         alert("The message is empty");
    //         return;
    //     }
    //     setIsSending(true);

    //     const tempMessage = {
    //         id: Date.now(), // temporary ID
    //         content: newMessage,
    //         timestamp: new Date().toISOString(),
    //         sender: currentUser,
    //         receiver: isGroupChat ? undefined : id
    //     };

    //     setMessages((prevMessages) => [...prevMessages, tempMessage]);

    //     wsSendMessage(newMessage);

    //     try {
    //         if (isGroupChat) {
    //             await sendGroupMessage(id, newMessage);
    //         } else {
    //             await sendPrivateMessage(id, newMessage);
    //         }
    //     } catch (error) {
    //         console.error("Error saving message:", error);
    //         alert("Message not saved. Please try again.");
    //     }

    //     setNewMessage("");
    //     setIsSending(false);
    // };

    const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
        alert("The message is empty");
        return;
    }
    setIsSending(true);

    // Send message via WebSocket only
    wsSendMessage(newMessage);

    // Remove the REST API call below to avoid duplicate messages
    // try {
    //     if (isGroupChat) {
    //         await sendGroupMessage(id, newMessage);
    //     } else {
    //         await sendPrivateMessage(id, newMessage);
    //     }
    // } catch (error) {
    //     console.error("Error saving message:", error);
    //     alert("Message not saved. Please try again.");
    // }

    setNewMessage("");
    setIsSending(false);
};

    const handleEditMessage = async (messageId, oldContent) => {
        const newContent = prompt("Edit your message:", oldContent);
        if (newContent && newContent.trim() !== "") {
            wsEditMessage(messageId, newContent);
            try {
                if (isGroupChat) {
                    await editGroupChat(id, messageId, newContent);
                } else {
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
            wsDeleteMessage(messageId);
            try {
                await deleteMessage(messageId, isGroupChat, id);
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
            wsClearChat();
            try {
                if (isGroupChat) {
                    await clearGroupMessages(id);
                } else {
                    await clearPrivateMessages(id);
                }
                setMessages([]);
            } catch (error) {
                console.error("Error clearing messages:", error);
                alert("Failed to clear messages. Please try again.");
            }
        }
    };

    return (
        <div className="flex h-screen">
            <div className=" text-white ">
                <ChatSidebar/>
            </div>
            <div className="flex-1 flex flex-col relative background-div">
                {/* Connection status removed */}
                
                {/* Clear Messages Button */}
                <button
                    onClick={handleClearMessages}
                    className="absolute top-1 right-190 text-gray-900 px-3 py-1 hover:bg-gray-300 rounded-xl shadow-md transition-colors z-10 "
                >
                    Clear All Messages
                </button>
                <div className="flex-1 overflow-y-auto p-4 pb-16 background-div">
                    {/* Messages List */}
                    <TransitionGroup className="flex flex-col gap-2">
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
                                            e.preventDefault();
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
                className="p-4 border-t flex items-center justify-center gap-2 backdrop-blur-sm sticky bottom-0 z-10 ">
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
                        disabled={isSending}
                    >
                        {isSending ? (
                            <CircularProgress size={20} sx={{ color: 'white' }} />
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