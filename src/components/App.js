import Header from "../components/Header";
import Main from "../components/Main";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Start from "../components/Start";
import FinishScreen from "../components/FinishScreen";
import Question from "../components/Question";
import NextButton from "../components/NextButton";
import Progress from "./Progress";
import Timer from "./Timer";
import Footer from "./Footer";
import { useQuiz } from "../context/QuizContext";

export default function App() {
  const { status } = useQuiz();

  return (
    <div>
      <div className="app">
        <Header></Header>
        <Main>
          {status === "loading" && <Loader></Loader>}
          {status === "error" && <Error></Error>}
          {status === "ready" && <Start></Start>}
          {status === "active" && (
            <>
              <Progress></Progress>
              <Question></Question>
              <Footer>
                <Timer></Timer>
                <NextButton></NextButton>
              </Footer>
            </>
          )}
          {status === "finished" && <FinishScreen></FinishScreen>}
        </Main>
      </div>
    </div>
  );
}
