import { useEffect } from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Start from "../components/Start";
import FinishScreen from "../components/FinishScreen";
import Question from "../components/Question";
import NextButton from "../components/NextButton";
import { useReducer } from "react";
import Progress from "./Progress";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingTime: null,
};

function reducer(currState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...currState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...currState, status: "error" };
    case "start":
      return {
        ...currState,
        status: "active",
        remainingTime: currState.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = currState.questions.at(currState.index);
      return {
        ...currState,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? currState.points + question.points
            : currState.points,
      };
    case "nextQuestion":
      return { ...currState, index: currState.index + 1, answer: null };
    case "finish":
      return {
        ...currState,
        status: "finished",
        highscore:
          currState.points > currState.highscore
            ? currState.points
            : currState.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: currState.questions,
        status: "ready",
      };
    // return {
    //   ...currState,
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   highscore: 0,
    // };
    case "tick":
      return {
        ...currState,
        remainingTime: currState.remainingTime - 1,
        status: currState.remainingTime === 0 ? "finished" : currState.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, remainingTime },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div>
      <div className="app">
        <Header></Header>
        <Main>
          {status === "loading" && <Loader></Loader>}
          {status === "error" && <Error></Error>}
          {status === "ready" && (
            <Start numQuestions={numQuestions} dispatch={dispatch}></Start>
          )}
          {status === "active" && (
            <>
              <Progress
                index={index}
                numQuestions={numQuestions}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              ></Progress>
              <Question
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              ></Question>
              <Footer>
                <Timer
                  remainingTime={remainingTime}
                  dispatch={dispatch}
                ></Timer>
                <NextButton
                  dispatch={dispatch}
                  answer={answer}
                  index={index}
                  numQuestions={numQuestions}
                ></NextButton>
              </Footer>
            </>
          )}
          {status === "finished" && (
            <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highscore={highscore}
              dispatch={dispatch}
            ></FinishScreen>
          )}
        </Main>
      </div>
    </div>
  );
}
