import React, { useEffect, useState, useRef } from 'react';
import { deleteMessage, editMessage, fetchGroupMessages, fetchPrivateMessages, sendGroupMessage, sendPrivateMessage, clearGroupChat, clearPrivateChat, fetchUser } from "../../services/api";
import { useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MessagesList.css';

const MessagesList = ({ isGroupChat }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [editMessageId, setEditMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const nodeRefs = useRef({});

    useEffect(() => {
        // Fetch the current user's username
        const fetchCurrentUser = async () => {
            try {
                const response = await fetchUser();
                console.log("Current user:", response.data);
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

                const formattedMessages = response.data.map((message) => {
                    if (isGroupChat) {
                        return {
                            content: message.content,
                            timestamp: new Date(message.timestamp),
                            sender: { username: message.sender },
                            id: message.id,
                        };
                    } else {
                        return {
                            content: message.message,
                            timestamp: new Date(message.timestamp),
                            sender: { username: message.sender },
                            receiver: { username: message.receiver },
                            id: message.id,
                        };
                    }
                });

                const sortedMessages = formattedMessages.sort((a, b) => a.timestamp - b.timestamp);

                setMessages(sortedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [id, isGroupChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = isGroupChat
                ? await sendGroupMessage(id, newMessage)
                : await sendPrivateMessage(id, newMessage);

            const newMessageObject = isGroupChat
                ? {
                      content: response.data.content,
                      timestamp: response.data.timestamp,
                      sender: { username: currentUser },
                      id: response.data.id,
                  }
                : {
                      content: response.data.message,
                      timestamp: response.data.timestamp,
                      sender: { username: currentUser },
                      receiver: { username: response.data.receiver },
                      id: response.data.id,
                  };

            setMessages((prevMessages) => [...prevMessages, newMessageObject]);
            setNewMessage("");
            
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleRightClick = (e, messageId) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, messageId });
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            console.log("Deleting message with ID:", messageId, "Is Group Chat:", isGroupChat);
            await deleteMessage(messageId, isGroupChat, id);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
            setContextMenu(null);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleEditMessage = async (messageId, newContent) => {
        try {
            console.log("Editing message with ID:", messageId);
            const response = await editMessage(messageId, newContent);

            // Update the messages state with the edited message
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, content: newContent } : msg
                )
            );

            // Clear the edit state
            setEditMessageId(null);
            setEditedMessage("");
            setContextMenu(null);
        } catch (error) {
            console.error("Error editing message:", error);
        }
    };

    const handleClearMessages = async () => {
        try {
            if (isGroupChat) {
                await clearGroupChat(id);
            } else {
                await clearPrivateChat(id);
            }
            setMessages([]);
        } catch (error) {
            console.error("Error clearing messages:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <div className="flex-1 flex flex-col bg-black text-yellow-400">
                <div className="flex justify-end p-4">
                    <button
                        onClick={handleClearMessages}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Clear All Messages
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <TransitionGroup>
                        {messages.map((message, index) => {
                            if (!nodeRefs.current[index]) {
                                nodeRefs.current[index] = React.createRef();
                            }

                            const isSender = message.sender.username === currentUser;
                            console.log(currentUser, message.sender.username);
                            

                            return (
                                <CSSTransition
                                    key={index}
                                    timeout={300}
                                    classNames="message"
                                    nodeRef={nodeRefs.current[index]}
                                >
                                    <div
                                        ref={nodeRefs.current[index]}
                                        onContextMenu={(e) => handleRightClick(e, message.id)}
                                        className={`mb-4 p-3 rounded-lg max-w-fit ${
                                            isSender
                                                ? "bg-gray-700 text-right "
                                                : "bg-gray-800 text-left self-start"
                                        }`}
                                    >
                                        {editMessageId === message.id ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleEditMessage(message.id, editedMessage);
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={editedMessage}
                                                    onChange={(e) => setEditedMessage(e.target.value)}
                                                    className="border p-2 w-full bg-gray-800 text-yellow-400 rounded-lg"
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-yellow-500 text-black px-4 py-2 mt-2 rounded-lg"
                                                >
                                                    Save
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                <strong>{isSender ? "Me" : message.sender.username}:</strong> {message.content}
                                                <div className="text-sm text-gray-500">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </div>
                                            </>
                                        )}
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
                {contextMenu && (
                    <div
                        style={{
                            position: "absolute",
                            top: contextMenu.y,
                            left: contextMenu.x,
                            backgroundColor: "white",
                            border: "1px solid gray",
                            borderRadius: "5px",
                            zIndex: 1000,
                        }}
                        onMouseLeave={() => setContextMenu(null)}
                    >
                        <button
                            onClick={() => handleDeleteMessage(contextMenu.messageId)}
                            className="block px-4 py-2 text-black hover:bg-gray-200"
                        >
                            Delete Message
                        </button>
                        <button
                            onClick={() => {
                                setEditMessageId(contextMenu.messageId);
                                const messageToEdit = messages.find(
                                    (msg) => msg.id === contextMenu.messageId
                                );
                                setEditedMessage(messageToEdit.content); // Pre-fill the input with the current message content
                                setContextMenu(null);
                            }}
                            className="block px-4 py-2 text-black hover:bg-gray-200"
                        >
                            Edit Message
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesList;
