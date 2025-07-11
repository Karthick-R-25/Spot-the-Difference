import './gamefooter.css'

// GameFooter component displays progress and a final success message
function GameFooter({ found, total, timer }) {
  return (
    <div className="text-center mt-6">
      {/* Shows how many differences have been found out of total */}
      <p className="text-lg text-gray-700">
        Found {found} of {total} differences
      </p>

      {/* If the player has found all differences, show a congratulations message */}
      {found === total && 
        <div className='last'>
          <p className="text-pink-600 font-bold mt-2 lg:mt-9 text-4xl">
            You found all differences in {timer}s!
          </p>
        </div>
      }
    </div>
  );
}

export default GameFooter

