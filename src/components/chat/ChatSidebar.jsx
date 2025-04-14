import React, { useEffect, useState } from "react";
import { fetchGroupChats, fetchPrivateChatUsers } from "../../components/services/api";
import { Link, useNavigate } from "react-router-dom";
import Aichat from "./Aichat";
import { TextField, Button, Typography } from "@mui/material";
import Chatwellcommsg from "./Chatwellcommsg";
import { useLocation } from "react-router-dom";

const ChatSidebar = () => {
    const [groupChats, setGroupChats] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const navigate = useNavigate();

    // const handleAIChatClick = () => {
    //     setShowAIChat(true);
    //     navigate('/aiChat'); // Update URL
    // };

    const defaultGroupAvatar = '../../../src/assets/images/user-default.webp'
    const location = useLocation();
    
    const showWelcome = !(
        location.pathname.startsWith("/messagesList/") || 
        location.pathname === "/chat/aiChat" || location.pathname === "/Home" 
    );
    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const groupResponse = await fetchGroupChats();
                setGroupChats(groupResponse.data);
                const privateResponse = await fetchPrivateChatUsers();
                setPrivateChats(privateResponse.data);
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
                color: 'white',
                '&.MuiButton-contained': {
                    backgroundColor: 'white' ,
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
        <div className="flex mt-1">
        <div className="h-screen flex flex-col">
            {/* Mobile Toggle */}
           {/* Mobile Toggle - Moved to right side when sidebar is open */}
<button
    className={`md:hidden fixed z-50 p-2 bg-[#7a2226] text-white rounded-full shadow-lg transition-all duration-300 ${
        isSidebarOpen ? "left-[17rem] top-4" : "left-4 top-4"  // Moves button when sidebar opens
    }`}
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
    {isSidebarOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    )}
</button>

{/* Sidebar Content - Added higher z-index */}
<div className={`w-100 text-[#7a2226] h-[70vh] p-4 fixed md:relative transform mt-3 rounded-lg 
    ${isSidebarOpen ? "translate-x-0 z-40" : "-translate-x-full z-30"} 
    md:translate-x-0 transition-transform duration-300 border border-[#7a2226] 
    bg-[rgba(50,50,50,0.42)] backdrop-blur-sm`}>
                
                {/* Header */}
                <Typography variant="h6" className="!font-bold !mb-4 !text-[#7a2226]">
                    Messages
                </Typography>

                {/* Search Bar */}
                <TextField
                    style={{ color: 'white' }}
                    fullWidth
                    placeholder="Search Messages"
                    variant="outlined"
                    size="small"
                    sx={{
                        '& .MuiInputBase-root': {
                            color: 'white',
                            borderRadius: '8px',
                            borderColor: 'white '
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white '
                        },
                        marginBottom: '1.5rem'
                    }}
                />

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6" >
                    <FilterButton label="All" value="all"/>
                    <FilterButton label="Private" value="private"/>
                    <FilterButton label="Groups" value="groups"/>
                     
                </div>
                <Button 
                     fullWidth
                     variant="contained"
                    sx={{
                        backgroundColor: '#7a2226',
                        color: 'white',
                        '&:hover': { backgroundColor: '#5a181b' },
                        borderRadius: '20px',
                        textTransform: 'none',
                        py: 1
                    }}
                    onClick={() => navigate('/chat/aiChat')} // Use onClick instead of Link
                     startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                     }
                >
                    AI Chat
                </Button>
                {/* Chat List */}
                {/* <div className="space-y-4 overflow-y-auto h-[calc(100vh-220px)] pr-2"> */}
                <div className="space-y-4 overflow-y-auto h-100vh pr-2">

                    {/* Private Chats */}
                    {(activeFilter === 'all' || activeFilter === 'private') && privateChats.map(chat => (
                        <div key={chat.id} className="flex justify-between items-center p-2 
                            hover:bg-gray-800 rounded cursor-pointer"
                            onClick={() => navigate(`/messagesList/private/${chat.id}`)}>
                            <div>
                               
                                <Typography className=" !text-[#7a2226] !font-medium">
                                  {chat.username}
                                </Typography>
                                <Typography variant="caption" className=" !text-white line-clamp-1">
                                    {chat.lastMessage || "No messages yet"}
                                </Typography>
                               
                            </div>
                            <Typography variant="caption" className=" !text-white ">
                                {chat.lastActive || "4:43 PM"}
                            </Typography>
                            <hr></hr>
                        </div>
                         
                    ))}

                    {/* Group Chats */}
                    {(activeFilter === 'all' || activeFilter === 'groups') && groupChats.map(chat => (
                        <div key={chat.id} className="flex justify-between items-center p-2 
                             rounded cursor-pointer"
                            onClick={() => navigate(`/messagesList/group/${chat.id}`)}>
                            <div>
                                <Typography className="!font-medium flex items-center"> {/* Added items-center for vertical alignment */}
                                    <img
                                        src={ chat.authorAvatar || defaultGroupAvatar }
                                        alt="Avatar" // Use chat name or "Group Avatar" for better alt text
                                        // Apply Tailwind classes here instead of 'user-avatar'
                                        className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 border border-gray-600" // Example style
                                    />
                                    {chat.name}
                                </Typography>
                                <Typography style={{ color: 'white' }} variant="caption">
                                    {chat.lastMessage || "No messages yet"}
                                </Typography>
                            </div>
                            <Typography style={{ color: 'white' }} variant="caption" >
                                {chat.lastActive || "9:10 AM"}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {showWelcome && <Chatwellcommsg />}
        </div>
    );
};

export default ChatSidebar;