import React, { useEffect, useState } from 'react';
import axiosInstance from "../../axios";
import { useNavigate } from 'react-router-dom';

const ChatSidebar = () => {
    const [groupChats, setGroupChats] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axiosInstance.get('user-chat-dashboard/');
                setGroupChats(response.data.groups);
                setPrivateChats(response.data.private_chats);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="bg-gray-800 text-white h-screen w-64 p-4">
            <h2 className="text-2xl font-bold mb-6">Chats</h2>
            <h3 className="text-lg font-semibold mb-2">Group Chats</h3>
            <ul>
                {groupChats.map((chat) => (
                    <li
                        key={chat.id}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                        onClick={() => navigate(`/group/${chat.id}`)}
                    >
                        {chat.name}
                    </li>
                ))}
            </ul>
            <h3 className="text-lg font-semibold mt-6 mb-2">Private Chats</h3>
            <ul>
                {privateChats.map((chat) => (
                    <li
                        key={chat.id}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                        onClick={() => navigate(`/private/${chat.id}`)}
                    >
                        {chat.sender.username} ↔ {chat.receiver.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatSidebar;
