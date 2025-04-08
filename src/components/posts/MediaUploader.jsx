import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const MediaUploader = ({ attachments, setAttachments, maxFiles = 4, maxSize = 10 }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
            'video/*': ['.mp4', '.mov', '.webm']
        },
        maxFiles,
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
        onDrop: (acceptedFiles) => {
            setAttachments(prev => [...prev.slice(0, maxFiles - acceptedFiles.length), ...acceptedFiles]);
        }
    });

    const removeFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-4">
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto text-2xl text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">
                    Drag & drop files or click to upload (max {maxFiles} files, {maxSize}MB each)
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((file, index) => (
                    <div key={index} className="relative group">
                        {file.type.startsWith('image/') ? (
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-20 h-20 object-cover rounded-md"
                                alt="Preview"
                            />
                        ) : (
                            <video className="w-20 h-20 rounded-md bg-black">
                                <source src={URL.createObjectURL(file)} />
                            </video>
                        )}
                        <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                        >
                            <FiX className="text-sm" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaUploader;