import React, { useEffect, useState } from 'react';
import axiosInstance from "../../axios"; // Ensure this path is correct
import { useParams } from 'react-router-dom';

const MessagesList = ({ isGroupChat }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const endpoint = isGroupChat
                    ? `group-chats/${id}/messages/`
                    : `private-chats/${id}/messages/`;
                const response = await axiosInstance.get(endpoint);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [id, isGroupChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isGroupChat
                ? `group-chats/${id}/messages/`
                : `private-chats/${id}/messages/`;
            const response = await axiosInstance.post(endpoint, { content: newMessage });
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div key={message.id} className="mb-4">
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
