import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessagesList from '../components/chat/MessagesList';

const ChatPage = () => {
    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <div className="flex-1 bg-gray-100">
                <Routes>
                    <Route path="/group/:id" element={<MessagesList isGroupChat={true} />} />
                    <Route path="/private/:id" element={<MessagesList isGroupChat={false} />} />
                </Routes>
            </div>
        </div>
    );
};

export default ChatPage;
