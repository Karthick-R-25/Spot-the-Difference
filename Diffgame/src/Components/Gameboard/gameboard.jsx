import React from "react";

export default function GameBoard({
  images,
  differences,
  foundDiffs,
  onImageClick,
  imageRef,
  onImageLoad
}) {
  return (
    <div className="lg:flex justify-center gap-6 mt-9 relative">
      {images.map((src, index) => (
        <div key={index} className="relative">
          <img
            ref={index === 0 ? imageRef : null}
            src={src}
            alt={`Image ${index + 1}`}
            className="w-[500px] h-auto object-contain cursor-pointer"
            onClick={(e) => onImageClick(e, index)}
            onLoad={index === 0 ? onImageLoad : null}
          />

          {/* Show overlays on both images, based on left image scaling */}
          {imageRef?.current && foundDiffs.map((diffIndex) => {
            const diff = differences[diffIndex];
            if (!diff) return null;

            const img = imageRef.current;
            if (!img.naturalWidth || !img.naturalHeight) return null;

            const scaleX = img.width / img.naturalWidth;
            const scaleY = img.height / img.naturalHeight;

            const scaledX = diff.x * scaleX;
            const scaledY = diff.y * scaleY;
            const scaledW = diff.width * scaleX;
            const scaledH = diff.height * scaleY;

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
