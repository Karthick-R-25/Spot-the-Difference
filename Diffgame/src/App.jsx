import React, { useEffect, useState, useRef } from "react";

// Import game configuration, UI components, and sound effects
import gameData from './Data/gameConfig.json';
import GameHeader from "./Components/Gametitle/gametitle";
import GameBoard from "./Components/Gameboard/gameboard";
import GameFooter from "./Components/Gamefooter/gamefooter";
import successSound from './assets/success.mp3';
import failSound from './assets/failed.mp3';
import winSound from './assets/win.mp3';

export default function App() {
  // Track found differences and game timing
  const [foundDiffs, setFoundDiffs] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [clickPoint, setClickPoint] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Preload audio feedback
  const successAudio = new Audio(successSound);
  const failAudio = new Audio(failSound);
  const congratsAudioRef = new Audio(winSound);

  // Ref to access the left image's DOM node
  const imageRef = useRef(null);

  // Extract game data
  const { gameTitle, images, differences } = gameData;

  // Dynamically generate image URLs from assets folder
  const importedImages = images.map(name =>
    new URL(`./assets/${name}`, import.meta.url).href
  );

  // Update timer every second while game is active
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Stop timer when all differences are found
    if (foundDiffs.length === differences.length && differences.length > 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, foundDiffs, differences]);

  // Play win sound after finding all differences
  useEffect(() => {
    if (foundDiffs.length === differences.length && differences.length > 0) {
      setTimeout(() => {
        congratsAudioRef.play();
      }, 1000); // slight delay to avoid overlapping sounds
    }
  }, [foundDiffs, differences]);

  // Handle user clicking on the image
  const handleImageClick = (e, imgIndex) => {
    if (imgIndex !== 0) return; // Only accept clicks on the left image

    const img = e.target;
    const rect = img.getBoundingClientRect();

    // Get click position relative to image
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    setClickPoint({ x: clickX, y: clickY });

    // Calculate scale to match natural image size
    const scaleX = img.width / img.naturalWidth;
    const scaleY = img.height / img.naturalHeight;

    // Scale difference zones based on current image display
    const scaledDifferences = differences.map(diff => ({
      x: diff.x * scaleX,
      y: diff.y * scaleY,
      width: diff.width * scaleX,
      height: diff.height * scaleY,
    }));

    // Check if click lands in any unfound difference box
    const padding = 10;
    let matchedIndex = null;

    for (let index = 0; index < scaledDifferences.length; index++) {
      if (foundDiffs.includes(index)) continue; // Skip already found

      const { x, y, width, height } = scaledDifferences[index];
      const isInside =
        clickX >= x - 25 &&
        clickX <= x + width + padding &&
        clickY >= y - 15 &&
        clickY <= y + height + padding;

      if (isInside) {
        matchedIndex = index;
        break;
      }
    }

    // If matched, play success sound and record it; else play fail sound
    if (matchedIndex !== null) {
      successAudio.play();
      setFoundDiffs((prev) => [...prev, matchedIndex]);
      console.log("Found difference at index:", matchedIndex);
    } else {
      failAudio.play();
      console.log("Missed. No match.");
    }
  };

  // Render game layout
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <GameHeader title={gameTitle} timer={timer} />
      <GameBoard
        images={importedImages}
        differences={differences}
        foundDiffs={foundDiffs}
        onImageClick={handleImageClick}
        imageRef={imageRef}
        onImageLoad={() => setIsImageLoaded(true)}
        isImageLoaded={isImageLoaded}
      />
      <GameFooter
        found={foundDiffs.length}
        total={differences.length}
        timer={timer}
      />
    </div>
  );
}
