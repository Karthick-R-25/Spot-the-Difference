 import React from "react";

export default function DifferenceOverlay(props) {
  if (!props) return null;

  const { x, y, width, height } = props;

  // Optional safety: Skip if any required value is missing
  if ([x, y, width, height].some(v => v === undefined)) return null;

  return (
    <div
      className="absolute border-4 border-green-500 rounded-lg pointer-events-none animate-pulse"
      style={{
        top: y,
        left: x,
        width,
        height,
      }}
    />
  );
}
