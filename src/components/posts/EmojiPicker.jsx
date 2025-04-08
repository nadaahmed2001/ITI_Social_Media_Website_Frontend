// src/components/posts/EmojiPicker.jsx
import React, { useState, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Smile } from 'react-feather';

const EmojiPicker = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.emoji-picker-container')) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative emoji-picker-container">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="text-gray-500 hover:text-gray-700 transition p-1"
        type="button"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showPicker && (
        <div className="absolute bottom-8 right-0 z-50 shadow-lg">
          <Picker
            data={data}
            onEmojiSelect={(emoji) => {
              onSelect(emoji.native);
              setShowPicker(false);
            }}
            theme="light"
            previewPosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;