
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import EmojiPicker from './EmojiPicker';
import MediaUploader from './MediaUploader';

const MAX_COMMENT_PREVIEW = 200;
const MAX_REPLY_PREVIEW = 150;
const REPLIES_PER_PAGE = 5;

const CommentItem = ({ comment, postId }) => {
    const { currentUser } = useUser();
    const [expanded, setExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyPage, setReplyPage] = useState(1);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [newReply, setNewReply] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.comment);

    const displayedContent = expanded ? comment.comment : 
        comment.comment.slice(0, MAX_COMMENT_PREVIEW);

    const fetchReplies = useCallback(async (page = 1) => {
        try {
            const response = await axios.get(`/api/comments/${comment.id}/replies/`, {
                params: { page, page_size: REPLIES_PER_PAGE }
            });
            setReplies(prev => page === 1 ? 
                response.data.results : [...prev, ...response.data.results]);
            setHasMoreReplies(response.data.next !== null);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    }, [comment.id]);

    const handleReplySubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('body', newReply.trim());
            attachments.forEach(file => formData.append('attachments', file));

            const response = await axios.post(
                `/api/comments/${comment.id}/replies/`, 
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setReplies(prev => [response.data, ...prev]);
            setNewReply('');
            setAttachments([]);
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const handleUpdateComment = async () => {
        try {
            await axios.patch(`/api/comments/${comment.id}/`, {
                comment: editedContent.trim()
            });
            setIsEditing(false);
            // You might want to update parent component state here
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await axios.delete(`/api/comments/${comment.id}/`);
                // You should trigger a refetch in the parent component
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const toggleReplies = () => {
        const shouldFetch = !showReplies && replies.length === 0;
        setShowReplies(!showReplies);
        if (shouldFetch) fetchReplies(1);
    };

    return (
        <div className="flex space-x-2 mb-4">
            <img 
                src={comment.author.profile_picture || '/default-avatar.png'} 
                className="w-8 h-8 rounded-full"
                alt={comment.author.username}
            />
            
            <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm font-medium">
                                {comment.author.username}
                            </h4>
                            <p className="text-xs text-gray-500">
                                {new Date(comment.created_on).toLocaleString()}
                            </p>
                        </div>
                        
                        {comment.author.id === currentUser?.id && (
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-xs hover:text-primary-500"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                                <button 
                                    onClick={handleDeleteComment}
                                    className="text-xs hover:text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full border rounded-md p-2 text-sm"
                                rows="3"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 text-sm border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateComment}
                                    disabled={!editedContent.trim()}
                                    className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm mt-2">
                                {displayedContent}
                                {comment.comment.length > MAX_COMMENT_PREVIEW && (
                                    <button 
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-primary-500 hover:underline ml-1"
                                    >
                                        {expanded ? 'See less' : 'See more'}
                                    </button>
                                )}
                            </p>

                            {/* Comment attachments */}
                            {comment.attachments?.length > 0 && (
                                <div className="mt-2">
                                    {comment.attachments.map(attachment => (
                                        <img
                                            key={attachment.id}
                                            src={attachment.url}
                                            className="max-w-xs max-h-40 rounded-md"
                                            alt="Comment attachment"
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Reply section */}
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <button
                            onClick={toggleReplies}
                            className="text-xs text-primary-500 hover:underline"
                        >
                            {showReplies ? 'Hide replies' : `Show replies (${comment.replies_count})`}
                        </button>

                        {showReplies && (
                            <div className="mt-2 space-y-3">
                                {replies.map(reply => (
                                    <div key={reply.id} className="flex space-x-2 pl-2">
                                        <img 
                                            src={reply.author.profile_picture || '/default-avatar.png'} 
                                            className="w-6 h-6 rounded-full" 
                                            alt="Reply author"
                                        />
                                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-medium">
                                                    {reply.author.username}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(reply.created_on).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-xs mt-1">
                                                {reply.body.length > MAX_REPLY_PREVIEW && !reply.expanded
                                                    ? `${reply.body.slice(0, MAX_REPLY_PREVIEW)}...`
                                                    : reply.body}
                                                {reply.body.length > MAX_REPLY_PREVIEW && (
                                                    <button 
                                                        onClick={() => /* implement expand toggle */}
                                                        className="text-primary-500 hover:underline ml-1"
                                                    >
                                                        {reply.expanded ? 'See less' : 'See more'}
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {hasMoreReplies && (
                                    <button
                                        onClick={() => {
                                            setReplyPage(prev => prev + 1);
                                            fetchReplies(replyPage + 1);
                                        }}
                                        className="text-xs text-primary-500 hover:underline"
                                    >
                                        Load more replies
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-3 flex items-start space-x-2">
                            <img 
                                src={currentUser?.profile_picture || '/default-avatar.png'} 
                                className="w-6 h-6 rounded-full"
                                alt="Your profile"
                            />
                            <div className="flex-1">
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <input
                                        type="text"
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="flex-1 px-2 py-1 text-sm outline-none"
                                    />
                                    <EmojiPicker 
                                        onSelect={(emoji) => setNewReply(prev => prev + emoji)}
                                    />
                                </div>
                                <MediaUploader 
                                    attachments={attachments}
                                    setAttachments={setAttachments}
                                    maxFiles={1}
                                    maxSize={10}
                                />
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={!newReply.trim() && attachments.length === 0}
                                    className="mt-1 px-3 py-1 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 disabled:opacity-50 float-right"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;