import React from "react";

export default function Sidebar({ isDarkMode }) {
  return (
    <div
      className={
        isDarkMode
          ? "w-120 bg-gray-1000 text-white p-4 rounded-2xl"
          : "w-120 bg-gray-300 text-gray-200 p-4 rounded-2xl"
      }
    >
      {/* First Section (Personal Information) */}
      <div className="mb-6">
        <div
          className={
            isDarkMode
              ? "p-4 rounded-2xl bg-[#333] text-center"
              : "p-4 rounded-2xl bg-[#f9f9f9] text-center"
          }
        >
          {/* Image and Followers / Following */}
          <div className="flex justify-center items-center mb-4">
            <div className="flex-1 text-center">
              <p
                className={
                  isDarkMode ? "text-sm text-white" : "text-sm text-black"
                }
              >
                Followers
              </p>
              <p
                className={
                  isDarkMode ? "font-bold text-white" : "font-bold text-black"
                }
              >
                120
              </p>
            </div>
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover mx-4"
            />
            <div className="flex-1 text-center">
              <p
                className={
                  isDarkMode ? "text-sm text-white" : "text-sm text-black"
                }
              >
                Following
              </p>
              <p
                className={
                  isDarkMode ? "font-bold text-white" : "font-bold text-black"
                }
              >
                80
              </p>
            </div>
          </div>

          {/* Name and Role */}
          <p
            className={
              isDarkMode
                ? "text-xl font-semibold text-white mb-2"
                : "text-xl font-semibold text-black mb-2"
            }
          >
            John Doe
          </p>
          <p
            className={
              isDarkMode
                ? "text-sm text-gray-400 mb-4"
                : "text-sm text-black mb-4"
            }
          >
            Problem: Full Stack Developer
          </p>

          {/* Profile Button */}
          <button
            className={
              isDarkMode
                ? "block mb-2 mx-auto w-full p-2 rounded-full bg-[#666] text-white hover:bg-gray-700 transition-colors"
                : "block mb-2 mx-auto w-full p-2 rounded-full bg-[#f1f1f1] text-black hover:bg-gray-200 transition-colors"
            }
            style={
              isDarkMode
                ? { background: "linear-gradient(to bottom, #666, #444)" }
                : { background: "linear-gradient(to bottom, #666, #999)" }
            }
            onClick={() => (window.location.href = "/profile")}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Second Section (Filter Section) */}
      <div className="mb-6">
        <div
          className={
            isDarkMode
              ? "p-4 rounded-2xl bg-[#333]"
              : "p-4 rounded-2xl bg-[#f9f9f9]"
          }
        >
          <h3
            className={
              isDarkMode
                ? "text-center font-semibold text-white mb-4"
                : "text-center font-semibold text-black mb-4"
            }
          >
            Filter
          </h3>

          {/* Branch Dropdown */}
          <select
            className="w-full p-3 rounded-2xl text-white focus:outline-none mb-4 cursor-pointer hover:text-yellow-500 transition-colors"
            style={{
              background: isDarkMode
                ? "linear-gradient(to bottom, #666, #444)"
                : "linear-gradient(to bottom, #666, #999)",
            }}
          >
            <option
              className="hover:text-yellow-500 transition-colors text-black"
              value="all"
            >
              Branch :
            </option>
            <option className="text-black" value="branch1">
              Branch 1
            </option>
            <option className="text-black" value="branch2">
              Branch 2
            </option>
          </select>

          {/* Category Dropdown */}
          <select
            className="w-full p-3 rounded-2xl text-white focus:outline-none"
            style={{
              background: isDarkMode
                ? "linear-gradient(to bottom, #666, #444)"
                : "linear-gradient(to bottom, #666, #999)",
            }}
          >
            <option
              className="hover:text-yellow-300 transition-colors text-black"
              value="all"
            >
              Category :
            </option>
            <option className="text-black" value="category1">
              Category 1
            </option>
            <option className="text-black" value="category2">
              Category 2
            </option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-full bg-yellow-400 text-black p-2 hover:bg-yellow-500">
          Search
        </button>
        <button className="flex-1 rounded-full bg-red-600 text-white p-2 hover:bg-gray-700">
          Clear
        </button>
      </div>
    </div>
  );
}
