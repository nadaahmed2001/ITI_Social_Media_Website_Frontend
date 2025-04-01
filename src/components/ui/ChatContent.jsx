import { MessageCircle } from "lucide-react"; 
import React from "react";

export default function ChatContent({ isDarkMode }) {
  return (
    <div
      className={
        isDarkMode
          ? "w-120 bg-gray-1000 text-white p-4 rounded-2xl"
          : "w-120 bg-gray-300 text-gray-200 p-4 rounded-2xl"
      }
    >
      {/* Private Chat Section */}
      <div
        className={
          isDarkMode
            ? "p-4 rounded-2xl bg-[#333] text-white flex flex-col items-center mb-6"
            : "p-4 rounded-2xl bg-[#f9f9f9] text-black flex flex-col items-center mb-6"
        }
      >
        {/* Title */}
        <h3
          className={
            isDarkMode
              ? "text-center font-semibold text-white text-2xl mb-4"
              : "text-center font-semibold text-black text-2xl mb-4"
          }
        >
          Private Chat
        </h3>

        {/* Profile Section */}
        <div
        className={`flex justify-center items-center mb-4 p-4 rounded-lg shadow-md w-full ${
            isDarkMode ? "bg-[#222]" : "bg-[#777]"
        }`}
        >

          {/* Profile Picture */}
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-none w-16 h-16 object-cover mr-4" 
          />

          {/* Name and Unread Message Indicator */}
          <div className="flex flex-col flex-1">
            <p
              className={
                isDarkMode
                  ? "font-semibold text-white text-lg"
                  : "font-semibold text-black text-lg"
              }
            >
              John Doe
            </p>
            <p
              className={
                isDarkMode ? "text-sm text-gray-400" : "text-sm text-gray-700"
              }
            >
              Last message preview or status
            </p>
          </div>

          {/* Unread Messages Icon */}
          <div className="relative flex items-center">
            {/* Message Icon */}
            <MessageCircle
              size={36}
              className="text-yellow-500"
            />

            {/* Unread Messages Count */}
            <div
              className={
                isDarkMode
                  ? "absolute top-0 left-5 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  : "absolute top-0 left-5 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              3 
            </div>
          </div>
        </div>
      </div>

      {/* Group Chat Section */}
      <div
        className={
          isDarkMode
            ? "p-4 rounded-2xl bg-[#333] text-white flex flex-col items-center"
            : "p-4 rounded-2xl bg-[#f9f9f9] text-black flex flex-col items-center"
        }
      >
        {/* Title */}
        <h3
          className={
            isDarkMode
              ? "text-center font-semibold text-white text-2xl mb-4"
              : "text-center font-semibold text-black text-2xl mb-4"
          }
        >
          Group Chat
        </h3>

        {/* Profile Section */}
        <div
        className={`flex justify-center items-center mb-4 p-4 rounded-lg shadow-md w-full ${
            isDarkMode ? "bg-[#222]" : "bg-[#777]"
        }`}
        >
          {/* Profile Picture */}
          <img
            src="https://via.placeholder.com/100"
            alt="Group"
            className="rounded-none w-16 h-16 object-cover mr-4" 
          />

          {/* Name and Unread Message Indicator */}
          <div className="flex flex-col flex-1">
            <p
              className={
                isDarkMode
                  ? "font-semibold text-white text-lg"
                  : "font-semibold text-black text-lg"
              }
            >
              Group Name
            </p>
            <p
              className={
                isDarkMode ? "text-sm text-gray-400" : "text-sm text-gray-700"
              }
            >
              Last message preview or status
            </p>
          </div>

          {/* Unread Messages Icon */}
          <div className="relative flex items-center">
            {/* Message Icon */}
            <MessageCircle
              size={36} 
              className= "text-yellow-600" 
            />

            {/* Unread Messages Count */}
            <div
              className={
                isDarkMode
                  ? "absolute top-0 left-5 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  : "absolute top-0 left-5 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              5 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
