import React, { useEffect, useState } from 'react';
import { fetchGroupMessages, fetchPrivateMessages, sendGroupMessage, sendPrivateMessage } from "../../services/api";
import { useParams } from 'react-router-dom';

const MessagesList = ({ isGroupChat }) => {
    const { id } = useParams(); // Get the group or private chat ID from the URL
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = isGroupChat
                    ? await fetchGroupMessages(id) // Fetch group messages
                    : await fetchPrivateMessages(id); // Fetch private messages
                // Adjust the response structure to match the expected format
                const formattedMessages = response.data.map((message) => ({
                    ...message,
                    sender: { username: message.sender }, // Convert sender string to an object
                }));
                setMessages(formattedMessages); // Set the formatted messages
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [id, isGroupChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = isGroupChat
                ? await sendGroupMessage(id, newMessage) // Send a group message
                : await sendPrivateMessage(id, newMessage); // Send a private message
            // Append the new message with the correct structure
            const newMessageObject = {
                ...response.data,
                sender: { username: "You" }, // Assume the sender is the current user
            };
            setMessages((prevMessages) => [...prevMessages, newMessageObject]); // Append the new message
            setNewMessage(""); // Clear the input field
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <strong>{message.sender.username}:</strong> {message.content}
                        <div className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessagesList;
