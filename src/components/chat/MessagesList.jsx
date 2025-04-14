import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, fetchUser, 
    sendGroupMessage, sendPrivateMessage, editMessage, deleteMessage,
    clearGroupMessages, clearPrivateMessages ,editGroupChat } from "../../components/services/api";
import { useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MessagesList.css';

const MessagesList = ({token, isGroupChat }) => {
    // console.log( )
    const { id } = useParams(); // id is the group_id or user_id depending on the chat type
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null); // WebSocket reference
    const nodeRefs = useRef({}); // Store refs for each message

    // Temporary hardcoded token
    //  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTY4NjU4LCJpYXQiOjE3NDM4ODIyNTgsImp0aSI6IjNmZDEzN2RhMTVkNTRjZGE5ZTM3MGY2YjAxMTRmNmE3IiwidXNlcl9pZCI6NH0.attP3etscne7JkqU2zPSv-4t5VVpXeFiZum69LM90BY";
    if (!token) {
        console.error("No token passed to MessagesList component!");
    }
    // Memoize the WebSocket connection function
    const connect_to_group_chat = useCallback(() => {
        const socketUrl = isGroupChat
 
        ? `ws://127.0.0.1:8000/ws/chat/group/${id}/?token=${token}` // Group chat WebSocket URL
        : `ws://127.0.0.1:8000/ws/chat/private/${id}/?token=${token}`; // Private chat WebSocket URL

        socketRef.current = new WebSocket(socketUrl);

        // Log WebSocket events for debugging
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
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
                    // Handle real-time message editing
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
        }, 5000); // Fetch every 5 seconds

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
            <div className="bg-[#181819] text-white mt-28 ml-28 pr-10">
                <ChatSidebar/>
            </div>
            <div className="flex-1 flex flex-col text-[#7a2226] relative background-div">
                {/* Clear Messages Button */}
                <button
                    onClick={handleClearMessages}
                    className=" text-white rounded-lg absolute top-1 right-4 z-10 " //need to add some padding
                >
                    Clear All Messages
                </button>
                <div className="flex-1 overflow-x-hidden p-4 overflow-y-auto background-div">
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
                                        className={`max-w-[80%] sm:max-w-md p-3 rounded-xl shadow-md transition-all duration-300 ${
                                            message.sender === currentUser
                                                ? "ml-auto bg-[#7a2226] text-white text-right"
                                                : "mr-auto bg-gray-800 text-[#7a2226] text-left"
                                        } max-w-full sm:max-w-md`} // Full width on small screens, limited width on larger screens
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
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2 backdrop-blur-sm bg-gray-800">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-none outline-none px-4 py-2 rounded-lg  text-[#7a2226] placeholder-white focus:ring-2 focus:ring-[#7a2226] transition-all duration-200 bg-[rgba(199,199,199,0.591)]"
                    />
                    <button
                        type="submit"
                        className=" text-[#7a2226] bg-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSending} // Disable the button while sending
                    >
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessagesList;