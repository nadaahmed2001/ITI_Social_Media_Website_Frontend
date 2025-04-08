import React, { useState } from 'react';
// Import icons from react-icons
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';


export const MediaSlider = ({ attachments }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!attachments || attachments.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? attachments.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === attachments.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        // Added group class for button hover effects
        <div className="relative w-full group bg-black rounded-lg border border-gray-700"> {/* Added bg-black explicitly */}
            {/* Container to hide overflow */}
            <div className="overflow-hidden rounded-lg aspect-video"> {/* Maintain aspect ratio */}
                {/* Inner container for sliding */}
                <div
                    className="flex h-full transition-transform ease-in-out duration-500" // Smoother duration
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {/* Map over attachments */}
                    {attachments.map((attachment, index) => (
                         // Key must be on the direct child of map
                        <div key={attachment.id || index} className="w-full h-full flex-shrink-0 flex items-center justify-center"> {/* Center content */}
                            {/* Conditionally render image or video */}
                            {(attachment.resource_type === 'image' && attachment.url) ? (
                                <img
                                    src={attachment.url}
                                    className="block max-w-full max-h-full object-contain" // Use object-contain within centered flex item
                                    alt={`Attachment ${index + 1}`}
                                    // onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
                                />
                            ) : (attachment.resource_type === 'video' && attachment.url) ? (
                                <video
                                    src={attachment.url}
                                    controls // Ensure controls are present
                                    className="block max-w-full max-h-full object-contain" // Use object-contain
                                    preload="metadata"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-gray-500 text-sm"> Unsupported Attachment </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            {attachments.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevious}
                        className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-red-500 p-2 rounded-full shadow-md hover:bg-opacity-75 focus:bg-opacity-75 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 ring-offset-2 ring-offset-gray-800"
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft className="w-5 h-5 stroke-2" />
                    </button>
                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-red-500 p-2 rounded-full shadow-md hover:bg-opacity-75 focus:bg-opacity-75 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 ring-offset-2 ring-offset-gray-800"
                         // Removed: opacity-0 group-hover:opacity-100 focus:opacity-100
                        aria-label="Next slide"
                    >
                        <FiChevronRight className="w-5 h-5 stroke-2" />
                    </button>
                </>
            )}
        </div>
    );
};

// Make sure to export it if it's in its own file
export default MediaSlider;