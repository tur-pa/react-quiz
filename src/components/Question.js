import { useQuiz } from "../context/QuizContext";
import Options from "./Options";

function Question() {
  const { question } = useQuiz();
  return (
    <div>
      <h4>{question.question}</h4>
      <Options></Options>
    </div>
  );
}

export default Question;
