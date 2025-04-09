import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const MessageMenu = ({ onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setOpen(!open)} className="text-yellow-300 hover:text-yellow-400">
                <FiMoreVertical size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-6 bg-gray-800 border border-yellow-400 text-yellow-300 rounded-lg shadow-lg z-50 w-28">
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-yellow-500 hover:text-black"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageMenu;
