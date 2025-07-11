 import React from "react";

// This component displays a green animated rectangle overlay
// to highlight a found difference on the image.

export default function DifferenceOverlay(props) {
  // If no props provided, don't render anything
  if (!props) return null;

  // Destructure coordinates and dimensions of the difference area
  const { x, y, width, height } = props;

  // Ensure all values are present before rendering the overlay
  if ([x, y, width, height].some(v => v === undefined)) return null;

  return (
    <div
      // This div visually highlights the found difference
      className="absolute border-4 border-green-500 rounded-lg pointer-events-none animate-pulse"
      style={{
        top: y,        // Distance from the top of the container
        left: x,       // Distance from the left of the container
        width,         // Width of the overlay box
        height         // Height of the overlay box
      }}
    />
  );
}
