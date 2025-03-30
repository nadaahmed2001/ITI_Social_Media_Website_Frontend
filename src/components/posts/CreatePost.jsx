import React, { useState } from "react";
import ImageSharpIcon from "@mui/icons-material/ImageSharp";
import axios from "axios";
import "./Posts.css";

export default function CreatePost({ onPostCreated }) {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && !image) {
      alert("Post content or an image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("body", postText);
    if (image) {
      formData.append("attachments", image);
    }

    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth system
      const response = await axios.post("http://127.0.0.1:8000/api/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Post created successfully!");
        setPostText("");
        setImage(null);
        setPreview(null);
        if (onPostCreated) onPostCreated(response.data); // Update parent component
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post">
        <img src="" alt="User" className="user-avatar" />
        <input
          type="text"
          placeholder="Tell your friends about your thoughts..."
          value={postText}
          onChange={handleTextChange}
        />
        <label htmlFor="image-upload">
          <ImageSharpIcon className="ImageSharpIcon" />
        </label>
        <input type="file" id="image-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button className="post-submit" onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
}
