// GameHeader component displays the game title and the running timer
function GameHeader({ title, timer }) {
  return (
    <div className="text-center mb-6">
      {/* Game title */}
      <h1 className="text-3xl font-bold text-blue-400 mb-2">{title}</h1>

      {/* Timer display showing elapsed time in seconds */}
      <p className="text-gray-800 text-2xl">
        Time: <span className="text-red-500">{timer}s</span>
      </p>
    </div>
  );
}

export default GameHeader;
