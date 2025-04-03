import React, { useEffect, useState } from "react";
import { fetchGroupChats, fetchPrivateChatUsers } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
    const [groupChats, setGroupChats] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const groupResponse = await fetchGroupChats();
                setGroupChats(groupResponse.data);
                const privateResponse = await fetchPrivateChatUsers();
                setPrivateChats(privateResponse.data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="flex-4 bg-black text-yellow-400 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-8 mt-4 text-center">CHATS</h2>

                {/* Private Chats Section */}
                <div className="mb-8 bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-yellow-300 text-center">
                        Private Chats
                    </h4>
                    <ul className="space-y-2 flex flex-col items-center">
                        {privateChats.map((chat) => (
                            <li
                                key={chat.id}
                                className="bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors w-full max-w-xs"
                                onClick={() => navigate(`/messagesList/private/${chat.id}`)}
                            >
                                <div className="flex items-center">
                                    <div className="ml-2">
                                        <div className="font-medium text-yellow-400">{chat.username}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Group Chats Section */}
                <div className="mb-8 bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-yellow-300 text-center">
                        Group Chats
                    </h4>
                    <ul className="space-y-2 flex flex-col items-center">
                        {groupChats.map((chat) => (
                            <li
                                key={chat.id}
                                className="bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors w-full max-w-xs"
                                onClick={() => navigate(`/messagesList/group/${chat.id}`)}
                            >
                                <div className="flex items-center">
                                    <div className="ml-2">
                                        <div className="font-medium text-yellow-400">{chat.name}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
            </div>
        </div>
    );
};

export default ChatSidebar;