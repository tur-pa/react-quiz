import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

function Timer() {
  const { remainingTime, dispatch } = useQuiz();

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
