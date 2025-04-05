import React from "react";
import { ThumbsUp, Heart, Smile, Frown, Angry, Send, Share2, UserPlus } from "lucide-react";

export default function PostContent({ isDarkMode }) {
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Post Input Section */}
      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? "bg-[#333] text-white" : "bg-gray-200 text-black"
        } flex items-center`}
      >
        {/* User Profile Picture */}
        <img
          src="https://via.placeholder.com/50"
          alt="User"
          className="w-12 h-12 rounded-full object-cover mr-3"
        />

        {/* Post Input Box */}
        <input
          type="text"
          placeholder="What's on your mind?"
          className={`flex-1 p-2 rounded-lg outline-none ${
            isDarkMode ? "bg-[#222] text-white" : "bg-white text-black"
          }`}
        />
      </div>

      {/*Posts Display Section */}
      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? "bg-[#333] text-white" : "bg-gray-200 text-black"
        }`}
      >
        {/* User Info */}
        <div className="flex items-center justify-between mb-3">
          {/* Left: Profile Picture & Name */}
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>

          {/* Right: Follow Icon */}
          <button className="text-yellow-500 hover:text-blue-700 flex items-center space-x-2">
            <UserPlus size={22} />
            <span className="hidden md:inline">Follow</span>
          </button>
        </div>

        {/* Post Text */}
        <p className="mb-3">This is an example post with an image.</p>

        {/* Post Image */}
        <img
          src="https://via.placeholder.com/300"
          alt="Post"
          className="w-full rounded-lg object-cover mb-3"
        />

        {/* Reactions & Share Button */}
        <div className="flex justify-between items-center mb-3">
          {/* Reaction Buttons */}
          <div className="flex">
            <button className="text-yellow-500 px-2">
              <ThumbsUp size={20} />
            </button>

            <button className="text-yellow-500 px-2">
              <Heart size={20} />
            </button>

            <button className="text-yellow-500 px-2">
              <Smile size={20} />
            </button>

            <button className="text-yellow-500 px-2">
              <Frown size={20} />
            </button>

            <button className="text-yellow-500 px-2">
              <Angry size={20} />
            </button>
          </div>

          {/* Share Button (Yellow) */}
          <button className="bg-yellow-500 text-black px-3 py-1 rounded-lg flex items-center space-x-2">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        {/* Comment Input */}
      <div className="flex items-center space-x-2">
        {/* User Profile Image */}
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Comment Input */}
        <input
          type="text"
          placeholder="Write a comment..."
          className={`flex-1 p-2 rounded-lg outline-none ${
            isDarkMode ? "bg-[#222] text-white" : "bg-white text-black"
          }`}
        />


          {/* Send Icon */}
          <button className="text-yellow-500">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
