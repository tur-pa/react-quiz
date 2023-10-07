import { useEffect } from "react";

function Timer({ remainingTime, dispatch }) {
  const mins = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },

    [dispatch]
  );

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins} : {seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
