import React, { useState } from "react";
import ImageSharpIcon from "@mui/icons-material/ImageSharp";
import { createPost } from "../../services/api";
import "./Posts.css";

export default function CreatePost({ onPostCreated }) {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => setPostText(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postText.trim() && !image) {
      alert("Post content or an image is required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("body", postText);
    if (image) formData.append("attachments", image);

    try {
      const response = await createPost(formData);
      if (response.status === 201) {
        alert("Post created successfully!");
        setPostText("");
        setImage(null);
        setPreview(null);
        if (onPostCreated) onPostCreated(response.data); // Update parent state
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-post-container" onSubmit={handleSubmit}>
      <div className="create-post">
        <img src="/default-avatar.png" alt="User" className="user-avatar" />
        <input
          value={postText}
          onChange={handleTextChange}
          type="text"
          placeholder="Tell your friends about your thoughts..."
        />
        <label htmlFor="image-upload">
          <ImageSharpIcon className="ImageSharpIcon" />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button type="submit" className="post-submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}