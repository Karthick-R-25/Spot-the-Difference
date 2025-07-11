import React from "react";

// GameBoard Component: renders the image pair and the overlays for found differences
export default function GameBoard({
  images,          // Array of image paths (left and right image)
  differences,     // Array of difference box coordinates
  foundDiffs,      // Array of indexes of found differences
  onImageClick,    // Function to handle click on the image
  imageRef,        // Ref for the left image (used for scaling boxes)
  onImageLoad      // Callback when left image is loaded
}) {
  return (
    <div className="lg:flex justify-center gap-6 mt-9 relative">
      {images.map((src, index) => (
        <div key={index} className="relative">
          {/* Render each image */}
          <img
            ref={index === 0 ? imageRef : null} // Assign ref only to the left image
            src={src}
            alt={`Image ${index + 1}`}
            className="w-[500px] h-auto object-contain cursor-pointer"
            onClick={(e) => onImageClick(e, index)} // Handle clicks only on left image
            onLoad={index === 0 ? onImageLoad : null} // Trigger scaling only when left image loads
          />

          {/* Show green highlight boxes only on the left image */}
          {index === 0 && imageRef?.current && foundDiffs.map((diffIndex) => {
            const diff = differences[diffIndex]; // Get the difference box
            if (!diff) return null;

            const img = imageRef.current;
            if (!img.naturalWidth || !img.naturalHeight) return null;

            // Calculate scale to convert original coordinates to current rendered size
            const scaleX = img.width / img.naturalWidth;
            const scaleY = img.height / img.naturalHeight;

            const scaledX = diff.x * scaleX;
            const scaledY = diff.y * scaleY;
            const scaledW = diff.width * scaleX;
            const scaledH = diff.height * scaleY;

            // Render green border box on the found difference
            return (
              <div
                key={`${index}-${diffIndex}`}
                className="absolute border-4 border-green-500 rounded-md animate-pulse pointer-events-none"
                style={{
                  top: scaledY,
                  left: scaledX,
                  width: scaledW,
                  height: scaledH,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
