import React, { useEffect, useState, useRef } from "react";
import gameData from './Data/gameConfig.json';
import GameHeader from "./Components/Gametitle/gametitle";
import GameBoard from "./Components/Gameboard/gameboard";
import GameFooter from "./Components/Gamefooter/gamefooter";

export default function App() {
  const [foundDiffs, setFoundDiffs] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [clickPoint, setClickPoint] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const successAudio = new Audio("/assets/success.mp3");
  const failAudio = new Audio("/assets/failed.mp3");
  const congratsAudioRef = new Audio("/assets/win.mp3");



  const imageRef = useRef(null); // ✅ Fix: Declare imageRef here

  const { gameTitle, images, differences } = gameData;

  useEffect(() => {
    const interval = setInterval(() => {

      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    if (foundDiffs.length === differences.length && differences.length > 0) {
    clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startTime, foundDiffs, differences]);
  useEffect(() => {
  if (foundDiffs.length === differences.length && differences.length > 0) {
    setTimeout(() => {
      congratsAudioRef.play();
    }, 1000); // 1000ms = 1 second delay
  }
}, [foundDiffs, differences]);

  const handleImageClick = (e, imgIndex) => {
    if (imgIndex !== 0) return;

    const img = e.target;
    const rect = img.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setClickPoint({ x: clickX, y: clickY });

    const scaleX = img.width / img.naturalWidth;
    const scaleY = img.height / img.naturalHeight;

    const scaledDifferences = differences.map(diff => ({
      x: diff.x * scaleX,
      y: diff.y * scaleY,
      width: diff.width * scaleX,
      height: diff.height * scaleY,
    }));

    const padding = 10;
    let matchedIndex = null;

    for (let index = 0; index < scaledDifferences.length; index++) {
      if (foundDiffs.includes(index)) continue;

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

    if (matchedIndex !== null) {
      successAudio.play();
      setFoundDiffs((prev) => [...prev, matchedIndex]);
      console.log("Found difference at index:", matchedIndex);
    } else {
      failAudio.play();
      console.log("Missed. No match.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <GameHeader title={gameTitle} timer={timer} />
      <GameBoard
        images={images}
        differences={differences}
        foundDiffs={foundDiffs}
        onImageClick={handleImageClick}
        imageRef={imageRef}
        onImageLoad={() => setIsImageLoaded(true)}
        isImageLoaded={isImageLoaded}
      />
      <GameFooter found={foundDiffs.length} total={differences.length} timer={timer}/>
    </div>
  );
}
