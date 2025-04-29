import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, fetchUser, 
    sendGroupMessage, sendPrivateMessage, editMessage, deleteMessage,
    clearGroupMessages, clearPrivateMessages, editGroupChat } from "../../components/services/api";
import { useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import WebSocketManager from '../../utils/websocket';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MessagesList.css';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

const MessagesList = ({token, isGroupChat }) => {
    const { id } = useParams(); // id is the group_id or user_id depending on the chat type
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [reconnectCount, setReconnectCount] = useState(0);
    const messagesEndRef = useRef(null);
    const wsManager = useRef(null); // WebSocket manager reference
    const nodeRefs = useRef({}); // Store refs for each message
    
    // Get auth token from localStorage
    const authToken = token || localStorage.getItem("access_token"); 
    if (!authToken) {
        console.error("No token found for MessagesList component!");
    }

    // Initialize the WebSocketManager once
    useEffect(() => {
        wsManager.current = new WebSocketManager();
        
        // Initialize WebSocket configuration
        const initWebSocket = async () => {
            try {
                await wsManager.current.fetchConfig();
            } catch (error) {
                console.error("Failed to fetch WebSocket configuration:", error);
                setConnectionError("Failed to load chat configuration");
            }
        };
        
        initWebSocket();

        // Clean up WebSocket connection
        return () => {
            if (wsManager.current) {
                wsManager.current.disconnect();
            }
        };
    }, []);

    // Fetch the current user's username
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

    // Memoize the normalizeMessage function to prevent unnecessary re-renders
    const normalizeMessage = useCallback((message, fromWebSocket = false) => {
        // Handle different message structures based on chat type and source
        if (isGroupChat) {
            return {
                id: message.id || Date.now(),
                content: message.content || '',
                timestamp: message.timestamp || new Date().toISOString(),
                sender: message.sender || currentUser,
            };
        } else {
            // Private chat messages have a different structure
            return {
                id: message.id || Date.now(),
                content: fromWebSocket ? (message.content || message.message) : message.message,
                timestamp: message.timestamp || new Date().toISOString(),
                sender: message.sender || currentUser,
                receiver: message.receiver
            };
        }
    }, [isGroupChat, currentUser]); // Add dependencies here

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = isGroupChat
                    ? await fetchGroupMessages(id) 
                    : await fetchPrivateMessages(id);

                // Normalize the response data using our helper
                const normalizedMessages = response.data.map(message => 
                    normalizeMessage(message)
                );

                // Sort messages by timestamp
                const sortedMessages = normalizedMessages.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );

                setMessages(sortedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (id) {
            fetchMessages();
        }
    }, [id, isGroupChat, normalizeMessage]); // Add normalizeMessage to dependencies

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Send message handler
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) {
            alert("The message is empty");
            return;
        }

        if (!wsManager.current || !wsManager.current.isConnected) {
            setConnectionError("Not connected to chat server. Please wait or refresh the page.");
            return;
        }

        setIsSending(true);

        const messageData = {
            content: newMessage,
            sender: currentUser,
            chatId: id,
            timestamp: new Date().toISOString(),
        };

        // Send message via WebSocket with proper format
        wsManager.current.send({
            type: "chat_message",
            message: isGroupChat ? {
                content: newMessage,
                sender: currentUser,
                group_id: id
            } : {
                message: newMessage,
                sender: currentUser,
                receiver: id
            }
        });

        // Save message to database
        try {
            if (isGroupChat) {
                await sendGroupMessage(id, newMessage);
            } else {
                await sendPrivateMessage(id, newMessage);
            }

            // Optimistically update UI
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, messageData];
                return updatedMessages.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error saving message:", error);
        } finally {
            setIsSending(false);
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

    // Set up WebSocket event listeners and connect
    useEffect(() => {
        if (!wsManager.current || !authToken || !id) return;
        
        setIsConnecting(true);
        setConnectionError(null);
        
        // Path format for WebSocket connection
        const wsPath = isGroupChat 
            ? `chat/group/${id}/` 
            : `chat/private/${id}/`;
        
        // Set up message event listener
        const handleMessage = (data) => {
            console.log("WebSocket message received:", data);
            
            if (data.type === "chat_message") {
                const normalizedMessage = normalizeMessage(
                    isGroupChat ? data.message : data.message,
                    true
                );

                setMessages((prevMessages) => {
                    // Check if message already exists to avoid duplicates
                    if (prevMessages.some(msg => msg.id === normalizedMessage.id)) {
                        return prevMessages;
                    }
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
            }
        };
        
        const handleError = (error) => {
            console.error("WebSocket error:", error);
            
            // Handle specific error types
            if (error.type === 'auth_error') {
                setConnectionError("Authentication failed. Please log in again.");
                
                // Try to get a fresh token and reconnect
                const freshToken = localStorage.getItem('access_token');
                if (freshToken && freshToken !== authToken) {
                    console.log("Attempting reconnect with fresh token");
                    setTimeout(() => {
                        wsManager.current.connect(wsPath, freshToken);
                    }, 2000);
                }
            } else if (error.type === 'websockets_disabled') {
                setConnectionError("Chat service is currently unavailable. Please try again later.");
            } else {
                setConnectionError("Failed to connect to chat server. Please check your connection.");
            }
        };
        
        // Connection status handlers
        const handleOpen = () => {
            console.log("WebSocket connected successfully");
            setIsConnecting(false);
            setReconnectCount(0); // Reset reconnect count on successful connection
            setConnectionError(null);
        };
        
        const handleReconnecting = (data) => {
            setIsConnecting(true);
            setReconnectCount(data.attempt);
            console.log(`Reconnecting to WebSocket server (Attempt ${data.attempt}/${data.maxAttempts})`);
        };
        
        const handleReconnectFailed = () => {
            setConnectionError(`Unable to connect to chat server after multiple attempts. Please refresh the page.`);
            setIsConnecting(false);
        };
        
        // Register event listeners
        wsManager.current.addEventListener('message', handleMessage);
        wsManager.current.addEventListener('open', handleOpen);
        wsManager.current.addEventListener('error', handleError);
        wsManager.current.addEventListener('reconnecting', handleReconnecting);
        wsManager.current.addEventListener('reconnectFailed', handleReconnectFailed);
        
        // Check token validity before connecting
        const validateAndConnect = async () => {
            // Validate token first if we have the method
            if (wsManager.current.validateToken) {
                const validation = wsManager.current.validateToken(authToken);
                console.log('Token validation before connect:', validation);
                
                // If token appears to be expired, try to get a fresh one
                if (!validation.valid && validation.reason === 'Token is expired') {
                    const freshToken = localStorage.getItem('access_token');
                    if (freshToken && freshToken !== authToken) {
                        console.log("Using fresh token from localStorage");
                        wsManager.current.connect(wsPath, freshToken);
                        return;
                    }
                }
            }
            
            // Connect with provided token
            wsManager.current.connect(wsPath, authToken);
        };
        
        validateAndConnect();
        
        // Clean up event listeners when component unmounts or chat changes
        return () => {
            wsManager.current.removeEventListener('message', handleMessage);
            wsManager.current.removeEventListener('open', handleOpen);
            wsManager.current.removeEventListener('error', handleError);
            wsManager.current.removeEventListener('reconnecting', handleReconnecting);
            wsManager.current.removeEventListener('reconnectFailed', handleReconnectFailed);
        };
    }, [id, isGroupChat, authToken, currentUser, normalizeMessage]); // Add normalizeMessage to dependencies

    return (
        <div className="flex h-screen">
            <div className="text-white mt-15">
                <ChatSidebar/>
            </div>
            <div className="flex-1 flex flex-col relative background-div mt-[80px]">
                {/* Connection Status */}
                {isConnecting && (
                    <div className="bg-yellow-100 p-2 text-center text-yellow-800">
                        {reconnectCount > 0 
                            ? `Reconnecting to chat server (Attempt ${reconnectCount})...` 
                            : "Connecting to chat server..."}
                    </div>
                )}
                {connectionError && (
                    <div className="bg-red-100 p-2 text-center text-red-800">
                        {connectionError}
                    </div>
                )}
                
                {/* Clear Messages Button */}
                <button
                    onClick={handleClearMessages}
                    className="absolute top-1 right-190 text-gray-900 px-3 py-1 hover:bg-gray-300 rounded-xl shadow-md transition-colors z-10"
                >
                    Clear All Messages
                </button>
                
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 background-div mt-[100px]">
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
                
                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} 
                      className="p-4 border-t flex items-center justify-center gap-2 backdrop-blur-sm sticky bottom-0 z-10">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-none outline-none px-4 py-2 rounded-lg text-gray-900 placeholder-gray-900 focus:ring-2 focus:ring-[#7a2226] transition-all duration-200 bg-white"
                        disabled={!wsManager.current?.isConnected}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center w-10 h-10 text-white bg-[#7a2226] rounded-lg transition-all duration-200 hover:bg-[#5a181b] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSending || !wsManager.current?.isConnected}
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