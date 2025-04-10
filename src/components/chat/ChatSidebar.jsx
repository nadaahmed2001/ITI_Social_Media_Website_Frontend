import React, { useEffect, useState } from "react";
import { fetchGroupChats, fetchPrivateChatUsers } from "../../components/services/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const ChatSidebar = () => {
    const [groupChats, setGroupChats] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const [groups, privates] = await Promise.all([
                    fetchGroupChats(),
                    fetchPrivateChatUsers()
                ]);
                setGroupChats(groups.data);
                setPrivateChats(privates.data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChatData();
    }, []);

    const FilterButton = ({ label, value }) => (
        <Button
            variant={activeFilter === value ? "contained" : "outlined"}
            size="small"
            sx={{
                color: '#facc15',
                borderColor: '#facc15',
                '&.MuiButton-contained': {
                    backgroundColor: '#facc15 !important',
                    color: '#000 !important'
                },
                borderRadius: '20px',
                textTransform: 'none',
                px: 2
            }}
            onClick={() => setActiveFilter(value)}
        >
            {label}
        </Button>
    );

    return (
        <div className="h-screen flex flex-col">
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-yellow-400 rounded-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? "✕" : "☰"}
            </button>

            {/* Sidebar Content */}
            <div className={`w-64  text-yellow-400 h-full p-4 fixed md:relative transform 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
                transition-transform duration-300 border-r border-yellow-400`}>
                
                {/* Header */}
                <Typography variant="h6" className="!font-bold !mb-4 !text-yellow-400">
                    Messages
                </Typography>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search Messages"
                    variant="outlined"
                    size="small"
                    sx={{
                        '& .MuiInputBase-root': {
                            color: '#facc15',
                            borderRadius: '8px',
                            borderColor: '#facc15 !important'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#facc15 !important'
                        },
                        marginBottom: '1.5rem'
                    }}
                />

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                    <FilterButton label="All" value="all" />
                    <FilterButton label="Private" value="private" />
                    <FilterButton label="Groups" value="groups" />
                </div>

                {/* Chat List */}
                <div className="space-y-4 overflow-y-auto h-[calc(100vh-220px)] pr-2">
                    {/* Private Chats */}
                    {(activeFilter === 'all' || activeFilter === 'private') && privateChats.map(chat => (
                        <div key={chat.id} className="flex justify-between items-center p-2 
                            hover:bg-gray-800 rounded cursor-pointer"
                            onClick={() => navigate(`/messagesList/private/${chat.id}`)}>
                            <div>
                                <Typography className="!text-yellow-400 !font-medium">
                                    {chat.username}
                                </Typography>
                                <Typography variant="caption" className="!text-yellow-500 line-clamp-1">
                                    {chat.lastMessage || "No messages yet"}
                                </Typography>
                            </div>
                            <Typography variant="caption" className="!text-yellow-500">
                                {chat.lastActive || "4:43 PM"}
                            </Typography>
                        </div>
                    ))}

                    {/* Group Chats */}
                    {(activeFilter === 'all' || activeFilter === 'groups') && groupChats.map(chat => (
                        <div key={chat.id} className="flex justify-between items-center p-2 
                            hover:bg-gray-800 rounded cursor-pointer"
                            onClick={() => navigate(`/messagesList/group/${chat.id}`)}>
                            <div>
                                <Typography className="!text-yellow-400 !font-medium">
                                    {chat.name}
                                </Typography>
                                <Typography variant="caption" className="!text-yellow-500 line-clamp-1">
                                    {chat.lastMessage || "No messages yet"}
                                </Typography>
                            </div>
                            <Typography variant="caption" className="!text-yellow-500">
                                {chat.lastActive || "9:10 AM"}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;